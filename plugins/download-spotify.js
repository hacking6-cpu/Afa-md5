/*
Jangan Hapus Wm Bang 

*Spotifydl  Plugins Esm*

Ni

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

Buatan Sendiri Made in Hom
*/

import axios from 'axios';

async function downloadTrack(url) {
    const apiUrl = 'https://spotymate.com/api/download-track';
    const data = {
        url: url
    };
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://spotymate.com/'
    };

    try {
        const response = await axios.post(apiUrl, data, { headers: headers });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan URL Spotify track yang ingin di-download.\nContoh: . spotify https://open.spotify.com/track/6cHCixTkEFATjcu5ig8a7I');

    try {
        const result = await downloadTrack(text);
        
        if (!result.file_url) {
            return m.reply('Tidak dapat menemukan URL file audio.');
        }

        await conn.sendMessage(m.chat, {
            audio: { url: result.file_url },
            mimetype: 'audio/mpeg',
            filename: 'downloaded_audio.mp3'
        }, { quoted: m });

    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};

handler.help = ['spotify <url>'];
handler.tags = ['downloader']
handler.command = ['spotify'];
handler.limit = false;

export default handler;