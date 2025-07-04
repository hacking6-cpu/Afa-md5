import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
let stiker = await sticker(null, `https://telegra.ph/file/4749ebddec8e60a5c3b8d.png`, global.config.packname, global.config.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
conn.reply(m.chat,'ada yang nyariin nih sayang ✨ @6282176642989',m)   
}

handler.customPrefix = /^(shyo|yo|shyocannnn|shyoo|woi shyo)$/i;
handler.command = new RegExp();
export default handler