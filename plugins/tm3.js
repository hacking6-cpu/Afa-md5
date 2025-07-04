import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn }) => {
  try {
    const { data } = await axios.get('https://www.metrotvnews.com/news');
    const $ = cheerio.load(data);
    const result = [];

    $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div').each((index, element) => {
      const judul = $(element).find('h3 > a').attr('title');
      const link = 'https://www.metrotvnews.com' + $(element).find('h3 > a').attr('href');
      const thumb = $(element).find('img').attr('src').replace('w=300', 'w=720');
      const deskripsi = $(element).find('p').text().trim();

      if (judul && link && thumb && deskripsi) {
        result.push({ judul, link, thumb, deskripsi });
      }
    });

    const pesan = result.map((berita, index) => {
      return `Berita ${index + 1}:\n${berita.judul}\n\n${berita.deskripsi}\n\nLink: ${berita.link}\n\n`;
    }).join('\n\n');

    await conn.sendMessage(m.chat, pesan, 'text', { detectLinks: false });
  } catch (error) {
    await conn.sendMessage(m.chat, 'Error fetching data: ' + error.message, 'text');
  }
};

handler.help = ['metronews'].map(v => v + '');
handler.command = /^(metronews)$/i;
handler.limit = false;

export default handler;
