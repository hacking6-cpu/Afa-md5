import axios from 'axios';
import cheerio from 'cheerio';

async function drivenimeSearch(query) {
    try {
        const { data } = await axios.get('https://drivenime.com/?s=' + query);
        const $ = cheerio.load(data);
        const results = [];

        $('.post.excerpt').each((index, element) => {
            const title = $(element).find('.title a').text();
            const link = $(element).find('.title a').attr('href');
            const image = $(element).find('.featured-thumbnail img').attr('src');
            const genre = $(element).find('.theauthor').text().replace('Genre: ', '').trim();

            results.push({ title, link, image, genre });
        });

        return results;
    } catch (error) {
        return error.message;
    }
}

async function drivenimeDetail(urls) {
    try {
        const { data } = await axios.get(urls);
        const $ = cheerio.load(data);

        const title = $('.title.single-title').text().trim();
        const author = $('.theauthor a').text().trim();
        const date = $('.thetime').text().trim();
        const category = $('.thecategory a').text().trim();
        const image = $('#Info img').attr('src');

        const info = {};
        $('#Info table tbody tr').each((index, element) => {
            const key = $(element).find('.tablex').text().trim().replace(':', '');
            const value = $(element).find('td').last().text().trim();
            info[key] = value;
        });

        const episodes = [];
        $('h4').each((index, element) => {
            const episodeTitle = $(element).text().trim();
            const links = [];
            $(element).next('ul').find('li').each((i, el) => {
                const quality = $(el).find('strong').text().trim();
                const downloadLinks = [];
                $(el).find('a').each((j, link) => {
                    const url = $(link).attr('href');
                    const provider = $(link).text().trim();
                    downloadLinks.push({ provider, url });
                });
                links.push({ quality, downloadLinks: downloadLinks.slice(0, 5) });
            });
            episodes.push({ episodeTitle, links });
        });

        return { title, author, date, category, image, info, episodes };
    } catch (error) {
        return error.message;
    }
}

let handler = async (m, { conn, text }) => {
    let [type, ...args] = text.split(' ');
    let query = args.join(' ');

    if (!type || !query) {
        return m.reply('Gunakan format:\n*.drivenime search <query>*\n*.drivenime detail <url>*');
    }

    if (type === 'search') {
        let results = await drivenimeSearch(query);
        if (!results.length) return m.reply('Anime tidak ditemukan.');

        let firstAnime = results[0];
        let message = results.map(anime => 
            `*Nama Anime :* ${anime.title}\n*Genre :* ${anime.genre}\n*Link Anime :* ${anime.link}`
        ).join('\n\n');

        if (firstAnime.image) {
            conn.sendMessage(m.chat, { image: { url: firstAnime.image }, caption: message }, { quoted: m });
        } else {
            m.reply(message);
        }
    } else if (type === 'detail') {
        let result = await drivenimeDetail(query);
        if (typeof result === 'string') return m.reply('Gagal mengambil detail anime.');

        let message = `*Nama Anime :* ${result.title}\n*Rilis :* ${result.date}\n*Author :* ${result.author}\n*Kategori :* ${result.category}\n\n*Detail Info:*\n`;

        for (let key in result.info) {
            message += `- ${key}: ${result.info[key]}\n`;
        }

        message += '\n*Episode Tersedia:*\n';
        result.episodes.forEach((ep, i) => {
            message += `\n${ep.episodeTitle}\n`;
            ep.links.forEach(link => {
                message += `*${link.quality}*\n`;
                link.downloadLinks.forEach(dl => {
                    message += `- ${dl.provider}: ${dl.url}\n`;
                });
            });
        });

        if (result.image) {
            conn.sendMessage(m.chat, { image: { url: result.image }, caption: message }, { quoted: m })
            .catch(() => m.reply('Gagal mengirim gambar, mengirim teks saja...\n\n' + message));
        } else {
            m.reply(message);
        }
    } else {
        m.reply('Kategori tidak valid! Gunakan *search* atau *detail*.');
    }
};

handler.help = ['drivenime'].map(v => v + ' <search/detail> <query/url>');
handler.tags = ['anime']
handler.command = ['drivenime'];
handler.limit = false;

export default handler;