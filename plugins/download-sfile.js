/*
Jangan Hapus Wm Bang 

*Sfile Download Plugins Esm*

Iya In aja Semua Meskipun Gak tw apa apa 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J/1425
*/

import axios from 'axios'
import cheerio from 'cheerio'

async function sfile(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'referer': url,
        'user-Agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36',
      };

      let getPage = await axios.get(url, { headers });
      let $ = cheerio.load(getPage.data);
      let safelink = $("#safe_link").attr("href");

      headers.cookie = getPage.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
      headers.referer = safelink;

      let resPage = await axios.get(safelink, { headers });
      let s,f = cheerio.load(resPage.data);

      const [dl, [name, ext, size], downloaded, uploaded, mime, author] = [
        f("#download").attr("href")+'&k='+f("#download").attr("onclick").match(/&k='\+(.*?)';/)?.[1].replace("'",''),
        (()=>{s=f('.w3-text-blue b').text().match(/^(.+?)(?:\.([^.\s()]+))?(?:\s*\(([^)]*)\))?$/);return[s[1].trim(),s[2],s[3]]})(),
        $('.icon-cloud-download').parent().text().split(':')[1].trim(),
        $('.icon-upload').parent().text().split(':')[1].trim(),
        $('.list:nth-child(2)').eq(0).text().slice(3).trim(),
        $('.list a').first().text().trim(),
      ]

      resolve({
        name,
        size,
        author,
        uploaded,
        downloaded,
        mime,
        ext,
        dl
      });
    } catch (e) {
      reject(e);
    }
  });
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`Silahkan masukkan URL Sfile\nContoh: ${usedPrefix + command} https://sfile.mobi/87GP8jpuRar`);
  }
  
  if (!args[0].match(/sfile\.mobi/i)) {
    return m.reply('URL tidak valid! Pastikan URL dari sfile.mobi');
  }
  
  m.reply('Please Wait...');
  
  try {
    const result = await sfile(args[0]);
    
    let fileDetails = `*SFILE DOWNLOADER*\n\n`;
    fileDetails += `*File Name :* ${result.name}${result.ext ? `.${result.ext}` : ''}\n`;
    fileDetails += `*Size :* ${result.size || 'Tidak diketahui'}\n`;
    fileDetails += `*Author :* ${result.author || 'Tidak diketahui'}\n`;
    fileDetails += `*Upload Date:* ${result.uploaded || 'Tidak diketahui'}\n`;
    fileDetails += `*Total Download :* ${result.downloaded || '0'}\n`;
    fileDetails += `*Type :* ${result.mime || 'Tidak diketahui'}`;
    
    if (!result.dl) {
      return m.reply(`${fileDetails}\n\n❌ Link download tidak tersedia`);
    }
    
    try {
      const response = await axios.get(result.dl, {
        responseType: 'arraybuffer',
        headers: {
          'referer': args[0],
          'user-Agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36',
        }
      });
      
      const fileName = `${result.name}${result.ext ? `.${result.ext}` : ''}`;
      
      await conn.sendMessage(m.chat, { 
        document: response.data, 
        fileName: fileName,
        mimetype: result.mime || 'application/octet-stream',
        caption: fileDetails
      }, { quoted: m });
      
    } catch (downloadError) {
      m.reply(`${fileDetails}\n\n🔗 *Link Download:* ${result.dl}`);
    }
    
  } catch (e) {
    m.reply(`Terjadi kesalahan: ${e.message}`);
  }
};

handler.help = ['sfile'];
handler.tags = ['downloader'];
handler.command = /^(sfile)$/i;
handler.limit = false;

export default handler;