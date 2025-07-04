import fs from 'fs'

let handler = async (m, { conn }) => {
	let pfft = " ```🚩 Tekan Gambar Foto Diatas Bro``` ";
conn.sendMessage(m.chat, {
      text: pfft,
      contextInfo: {
      externalAdReply: {
      title: `Script Free Download In Group📥`,
      body: '[❗] Script Free No Sale Script',
      thumbnailUrl: `https://files.catbox.moe/968xpy.jpg`,
      sourceUrl: 'https://chat.whatsapp.com/IFK1YCPjygj3PdJ5Z6k9h9`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
}
handler.command = /^(sc|script)$/i;
Handler.tags = ['info'];

export default handler;