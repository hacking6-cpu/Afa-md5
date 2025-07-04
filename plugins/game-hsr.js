import axios from 'axios';
import cheerio from 'cheerio';

async function statsStarRail() {
    const url = 'https://genshin.gg/star-rail/character-stats/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const characters = [];

    $('.rt-tr').each((index, element) => {
        const characterName = $(element).find('.character-name').text();
        if (characterName) {
            const hp = $(element).find('div').eq(1).text();
            const atk = $(element).find('div').eq(2).text();
            const def = $(element).find('div').eq(3).text();
            const speed = $(element).find('div').eq(4).text();
            const taunt = $(element).find('div').eq(5).text();
            const image = $(element).find('img.character-icon').attr('src');

            characters.push({ 
                name: characterName, 
                hp, 
                atk, 
                def, 
                speed, 
                taunt, 
                image: image.startsWith('http') ? image : `https://genshin.gg${image}`
            });
        }
    });

    return characters;
}

async function detailStarRail(urls) {
    const { data } = await axios.get(urls);
    const $ = cheerio.load(data);
    const fugueData = {};

    // Scrape detail karakter
    fugueData.name = $('.character-info-name').text().trim();
    fugueData.image = $('.character-info-portrait').attr('src') || '';
    fugueData.element = $('.character-info-element').attr('src')?.split('/').pop().split('.')[0] || 'Unknown';
    fugueData.path = $('.character-info-path').text().trim();
    fugueData.description = $('.character-info-intro').find('p').text().trim();

    // Scrape stats
    fugueData.stats = {
        hp: $('.character-info-stat').eq(0).find('.character-info-stat-value').text(),
        atk: $('.character-info-stat').eq(1).find('.character-info-stat-value').text(),
        def: $('.character-info-stat').eq(2).find('.character-info-stat-value').text(),
        speed: $('.character-info-stat').eq(3).find('.character-info-stat-value').text(),
        taunt: $('.character-info-stat').eq(4).find('.character-info-stat-value').text()
    };

    // Scrape materials
    fugueData.materials = [];
    $('.character-info-materials-item').each((index, element) => {
        const materialName = $(element).find('.character-info-materials-name').text().trim();
        const materialImage = $(element).find('.character-info-materials-icon').attr('src');
        fugueData.materials.push({ 
            name: materialName, 
            image: materialImage.startsWith('http') ? materialImage : `https://genshin.gg${materialImage}`
        });
    });

    // Format output
    let message = `
*${fugueData.name}*
〚 Element 〛: ${fugueData.element}
〚 Path 〛: ${fugueData.path}

*STATS*
🩸 HP: ${fugueData.stats.hp}
⚔️ ATK: ${fugueData.stats.atk}
🛡️ DEF: ${fugueData.stats.def}
👟 Speed: ${fugueData.stats.speed}
🎯 Taunt: ${fugueData.stats.taunt}

📝 *Description:*
${fugueData.description}

🔧 *Ascension Materials:*
${fugueData.materials.map(m => `- ${m.name}`).join('\n')}
    `.trim();

    return { message, image: fugueData.image };
}

const handler = async (m, { args }) => {
    const query = args.join(' ')?.toLowerCase();
    if (!query) return m.reply(`Contoh: *${handler.command[0]} kafka*`);

    try {
        const characters = await statsStarRail();
        const char = characters.find(c => c.name.toLowerCase() === query);
        
        if (!char) {
            const suggestion = characters.slice(0, 5).map(c => `› ${c.name}`).join('\n');
            return m.reply(`Karakter tidak ditemukan!\nContoh:\n${suggestion}`);
        }

        const detailUrl = `https://genshin.gg/star-rail/characters/${char.name.toLowerCase()}`;
        const { message, image } = await detailStarRail(detailUrl);
        
        await conn.sendMessage(m.chat, { 
            image: { url: image || char.image }, 
            caption: message,
            footer: `🎮 Honkai: Star Rail Character Info`,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        m.reply('Gagal mengambil data karakter!');
    }
};

handler.help = ['starrail'].map(v => v + ' <nama>');
handler.command = /^(starrail|hsr)$/i;
handler.tags = ['game'];
handler.limit = false;

export default handler;