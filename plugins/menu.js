let handler = async (m, { conn }) => {
  let caption = `*Hallo kak, ada yang bisa saya bantu kak? aku adalah asistent bot whatsapp di rancang untuk mempermudah kalian dalam segala hal*

┏━━  *BOT INFORMATION*  ━━┓
┃                                                  
┃ *✨Bot name: Mahiru Asistent*          
┃ *✨Creator: ShyoID*                            
┃ *✨Version: 2.0.0*
┃ *✨Type: Plugins ESM*
┃
┃ *Jangan Spam Bot Yah Kak!*
┃
┗━━━━━━━━━━━━━━━━━`
  
  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/ti9ls5.jpg' },
    gifPlayback: true,
    caption,
    footer: '✨Mahiru Asistent - 2025',
    buttons: [{ buttonId: '.allmenu', buttonText: { displayText: 'All Menu' }, type: 1 }],
    headerType: 1,
    viewOnce: true
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    audio: { url: 'https://files.catbox.moe/17kqun.mp3' },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.help = ['menu']
handler.command = ['menu']
handler.tags = ['main']
handler.limit = false

export default handler