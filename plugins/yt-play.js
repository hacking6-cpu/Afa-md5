import axios from 'axios';
import crypto from 'crypto';

const handler = async (m, { conn, args, command }) => {
  if (args.length < 1) return m.reply(`Format:\n- *${command} <url> [quality]* (untuk video)\n- *${command} <url>* (untuk audio)\n\n*Quality tersedia:* 144, 240, 360, 480, 720, 1080 (default: 720p untuk video)`);

  let url = args[0];
  let format = command === 'ytmp3' ? 'mp3' : args[1] || '720';

  if (!/^https?:\/\/(www\.)?youtube\.com|youtu\.be/.test(url)) return m.reply("Masukkan link YouTube yang valid.");

  try {
    let res = await downloadYouTube(url, format);
    if (!res.status) return m.reply(`❌ *Error:* ${res.error}`);

    let { title, download, type } = res.result;

    if (type === 'video') {
      await conn.sendMessage(m.chat, { 
        video: { url: download }
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { 
        audio: { url: download }, 
        mimetype: 'audio/mpeg', 
        fileName: `${title}.mp3` 
      }, { quoted: m });
    }
  } catch (e) {
    m.reply(`❌ *Gagal mengunduh!*`);
  }
};

handler.help = ['ytmp4', 'ytmp3'];
handler.command = ['ytmp4', 'ytmp3'];
export default handler;

// =========================================

async function downloadYouTube(link, format = '720') {
  const apiBase = "https://media.savetube.me/api";
  const apiCDN = "/random-cdn";
  const apiInfo = "/v2/info";
  const apiDownload = "/download";

  const decryptData = async (enc) => {
    try {
      const key = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return JSON.parse(decrypted.toString());
    } catch (error) {
      return null;
    }
  };

  const request = async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : apiBase}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://yt.savetube.me',
          'referer': 'https://yt.savetube.me/',
          'user-agent': 'Postify/1.0.0'
        }
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  };

  const youtubeID = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (!youtubeID) return { status: false, error: "Gagal mengekstrak ID video dari URL." };

  try {
    const cdnRes = await request(apiCDN, {}, 'get');
    if (!cdnRes.status) return cdnRes;
    const cdn = cdnRes.data.cdn;

    const infoRes = await request(`https://${cdn}${apiInfo}`, { url: `https://www.youtube.com/watch?v=${youtubeID[1]}` });
    if (!infoRes.status) return infoRes;
    
    const decrypted = await decryptData(infoRes.data.data);
    if (!decrypted) return { status: false, error: "Gagal mendekripsi data video." };

    const downloadRes = await request(`https://${cdn}${apiDownload}`, {
      id: youtubeID[1],
      downloadType: format === 'mp3' ? 'audio' : 'video',
      quality: format,
      key: decrypted.key
    });

    return {
      status: true,
      result: {
        title: decrypted.title || "Tidak diketahui",
        type: format === 'mp3' ? 'audio' : 'video',
        format: format,
        download: downloadRes.data.data.downloadUrl
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
}