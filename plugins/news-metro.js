import axios from 'axios';
import cheerio from 'cheerio';

async function metronews() {
    try {
        const { data } = await axios.get('https://www.metrotvnews.com/news');
        const $ = cheerio.load(data);
        const judul = [];
        const desc = [];
        const link = [];
        const result = [];
        
        $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a').each(function(a, b) {
            judul.push($(b).attr('title'));
        });
        
        $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > p').each(function(a, b) {
            const deta = $(b).text();
            desc.push(deta);
        });
        
        $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a').each(function(a, b) {
            link.push('https://www.metrotvnews.com' + $(b).attr('href'));
        });
        
        for (let i = 0; i < judul.length; i++) {
            result.push({
                judul: judul[i],
                link: link[i],
                deskripsi: desc[i]
            });
        }
        
        return result;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}

const handler = async (m, { conn, text }) => {
    try {
        const news = await metronews();
        const maxNews = Math.min(news.length, 10);
        
        // Tentukan satu gambar yang akan digunakan untuk semua berita
        const singleImageUrl = 'https://www.pic.surf/svy'; // Ganti dengan URL gambar yang diinginkan
        
        // Kirim gambar satu kali
        await conn.sendMessage(m.chat, { image: { url: singleImageUrl }, caption: '*Informasi Berita Dari Metro Dibawah Ini*' });
        
        // Kirim teks berita
        for (let i = 0; i < maxNews; i++) {
            const item = news[i];
            const message = `*${item.judul}*
            

*Lebih Lanjut:* ${item.link}`;
            await conn.sendMessage(m.chat, { text: message });
        }
    } catch (error) {
        await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat mengambil berita.' });
    }
};

handler.help = ['metrotv'];
handler.tags = ["search"];
handler.command = /^(metrotv)$/i;
handler.limit = false;

export default handler;