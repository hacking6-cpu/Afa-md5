/*
Jangan Hapus Wm Bang 

*Text2img  Plugins Esm*

Iya In Aja Meski Gak Tawu Apa Apa 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n/178
*/

import axios from 'axios'
import { translate } from 'bing-translate-api'

let size = [512, 768, 1024, 1200]

async function text2img(prompt, size = 512) {
    let { data } = await axios.post('https://ftvwohriusaknrzfogjh.supabase.co/functions/v1/generate-image', {
        "prompt": prompt + ", professional photograph, raw photo, unedited photography, photorealistic, 8k uhd, high quality dslr photo, sharp focus, detailed, crystal clear, natural lighting",
        "width": size,
        "height": size
    }, {
        headers: {
            "authority": "ftvwohriusaknrzfogjh.supabase.co",
            "Content-Type": "application/json",
            "Origin": "https://aiimagegenerator.site",
            "Referer": "https://aiimagegenerator.site/",
            "priority": "u=0, i",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs"
        }
    })

    let base64 = data.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    if (data.status == 500) return { success: false }
    return { success: true, image: base64 }
}

const handler = async (m, { conn, text, args }) => {
    if (!text) return m.reply('Contoh Penggunaan .text2img Anak Perempuan Jepang Sedang Berlari Ke Kuil')

    let selectedSize = 512
    if (args.length > 1) {
        const lastArg = parseInt(args[args.length - 1])
        if (size.includes(lastArg)) {
            selectedSize = lastArg
            text = args.slice(0, -1).join(' ')
        }
    }

    try {
        let translated = await translate(text, null, 'en')
        let result = await text2img(translated.translation, selectedSize)
        
        if (!result.success) return m.reply('Gagal membuat gambar, coba lagi!')
        
        let buffer = Buffer.from(result.image, 'base64')
        await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })

    } catch (error) {
        m.reply('Terjadi kesalahan, coba lagi nanti!')
    }
}

handler.help = ['text2img']
handler.tags = ['ai']
handler.command = /^(text2img)$/i

export default handler