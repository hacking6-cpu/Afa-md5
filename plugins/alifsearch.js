import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan kata kunci pencarian!');

    try {
        const { data } = await axios.get('https://alif.id/?s=' + text);
        const $ = cheerio.load(data);
        const results = [];

        $('.post.style3').each((index, element) => {
            const title = $(element).find('.post-title h5 a span').text();
            const link = $(element).find('.post-title h5 a').attr('href');
            const author = $(element).find('.post-author a').text();
            const authorLink = $(element).find('.post-author a').attr('href');
            const date = $(element).find('.post-date').text();
            const category = $(element).find('.post-category a').text();
            const categoryLink = $(element).find('.post-category a').attr('href');
            const image = $(element).find('figure.post-gallery img').attr('data-src');

            results.push({
                title,
                link,
                author,
                authorLink,
                date,
                category: category || 'Tidak ada kategori',
                categoryLink: categoryLink || null,
                image
            });
        });

        if (results.length === 0) {
            return m.reply('Tidak ada data ditemukan.');
        }

        let message = '*Hasil Pencarian Alif.id*\n\n';
        results.forEach((result, index) => {
            message += `*${index + 1}. ${result.title}*\n`;
            message += `📎 Link: ${result.link}\n`;
            message += `✍️ Penulis: ${result.author} (${result.authorLink})\n`;
            message += `📅 Tanggal: ${result.date}\n`;
            message += `🏷️ Kategori: ${result.category} (${result.categoryLink || 'Tidak ada link kategori'})\n\n`;
        });

        conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ['alifsearch <kata kunci>'];
handler.command = /^(alifsearch)$/i;
handler.limit = false;

export default handler;
