import axios from 'axios';

async function ttstalk(username) {
    if (!username) return {
        error: 'Masukkan username TikTok.'
    };

    let url = 'https://tiktoklivecount.com/search_profile';
    let data = {
        username: username.startsWith('@') ? username : `@${username}`
    };

    try {
        let res = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://tiktoklivecount.com/'
            }
        });

        let json = res.data;
        if (!json || !json.followers) return {
            error: 'Profil tidak ditemukan.'
        };

        return {
            name: json.name,
            username: username,
            Pengikut: json.followers,
            Top: json.rankMessage.replace(/<\/?b>/g, '') || 'Tidak tersedia',
            url_profile: json.profile_pic
        };
    } catch (error) {
        return {
            error: 'Error saat mengambil data.'
        };
    }
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*Masukkan username TikTok!*\nContoh: .ttstalk mrbeast');
    
    m.reply('*Searching...*');
    
    try {
        const result = await ttstalk(text);
        
        if (result.error) {
            return m.reply(result.error);
        }
        
        let caption = `*TIKTOK STALK*\n\n`;
        caption += `*Name :* ${result.name}\n`;
        caption += `*Username :* ${result.username}\n`;
        caption += `*Follower :* ${result.Pengikut.toLocaleString()}\n`;
        caption += `*Ranking :* ${result.Top}\n`;
        
        await conn.sendMessage(m.chat, { 
            image: { url: result.url_profile },
            caption: caption,
            mentions: [m.sender]
        });
        
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat mengambil data TikTok.');
    }
};

handler.help = ['ttstalk'];
handler.tags = ['stalker'];
handler.command = /^(ttstalk|tiktokstalk)$/i;
handler.limit = false;

export default handler;