import axios from 'axios';
import cheerio from 'cheerio';

async function swallpapercraft(query) {
    return new Promise((resolve, reject) => {
        axios.get('https://wallpaperscraft.com/search/?query=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                $('span.wallpapers__canvas').each(function (a, b) {
                    let img = $(b).find('img').attr('src');
                    if (img) result.push(img);
                });
                resolve(result);
            })
            .catch(reject);
    });
}

let handler = async (m, { text, conn }) => {
    if (!text) return m.reply('Masukkan query, contoh: wallcraft anime | 5');

    let [query, jumlah] = text.split('|').map(v => v.trim());
    jumlah = parseInt(jumlah) || 10;

    if (jumlah > 20) return m.reply('Maksimal 20 Gambar.');
    
    try {
        let images = await swallpapercraft(query);
        if (images.length === 0) return m.reply('Tidak ditemukan wallpaper.');
        
        let count = Math.min(jumlah, images.length);
        for (let i = 0; i < count; i++) {
            await conn.sendMessage(m.chat, { image: { url: images[i] } }, { quoted: m });
        }
    } catch (e) {
        m.reply('Terjadi kesalahan saat mengambil data.');
    }
};

handler.help = ['wallcraft '];
handler.command = ['wallcraft'];
handler.tags = ['search']
handler.limit = false;

export default handler;