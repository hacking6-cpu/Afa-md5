import axios from 'axios';

async function capcut(url) {
  let { data } = await axios.post('https://3bic.com/api/download', { url }, {
    headers: {
      "content-type": "application/json",
      "origin": "https://3bic.com",
      "referer": "https://3bic.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  });
  data.originalVideoUrl = 'https://3bic.com' + data.originalVideoUrl;
  return data;
}

let handler = async (m, { args, conn }) => {
  if (!args[0]) return m.reply('Masukkan link CapCut yang valid.');
  
  try {
    let res = await capcut(args[0]);
    await conn.sendMessage(m.chat, { video: { url: res.originalVideoUrl } }, { quoted: m });
  } catch (e) {
    m.reply('Gagal mengambil video. Pastikan link valid atau coba lagi nanti.');
  }
};

handler.help = ['cc2'];
handler.command = ['cc2'];
handler.limit = false;

export default handler;