import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Example: ${usedPrefix}spotify Blue Young Khai`;   
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key }});
    const result = await searchSpotify(text);
    const title = result.name;
    let responseText = 'Reply Pesan Dengan Nomer Judul.\n\n';
    result.forEach((track, index) => {
        responseText += `*${index + 1}.* ${track.name} - ${track.artists}\n`;
    });
    responseText += `\nPowered by: Bella\n\n*Example: <Reply> 1.*`;   
    const { key } = await conn.reply(m.chat, responseText, m);   
    conn.spotifPlay[m.sender] = { result, key, title };
};

handler.before = async (m, { conn }) => {
    conn.spotifPlay = conn.spotifPlay ? conn.spotifPlay : {};
    if (m.isBaileys || !(m.sender in conn.spotifPlay)) return;
    const { result, key, title } = conn.spotifPlay[m.sender];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
    const choice = m.text.trim();
    const inputNumber = Number(choice);
    if (inputNumber >= 1 && inputNumber <= result.length) {
        const selectedTrack = result[inputNumber - 1];
        try {
            const start = new Date();
            let res = await spotifydl(selectedTrack.link);
            const timeTaken = ((new Date() - start) / 1000).toFixed(2) + ' seconds';

            const durationInSeconds = Math.floor(selectedTrack.duration_ms / 1000);
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            const durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            const thumbnail = selectedTrack.image;                       
            await conn.sendMessage(m.chat, {
                audio: { url: `${res.download}` },
                mimetype: 'audio/mp4', 
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: false,
                        mediaType: 1,
                        title: 'Bot',
                        body: 'Version: 3.0.2',
                        thumbnailUrl: 'https://via.placeholder.com/150',
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
            conn.sendMessage(m.chat, { delete: key });
            delete conn.spotifPlay[m.sender];
        } catch (error) {
            console.error('Error downloading and sending audio:', error);
            await conn.reply(m.chat, 'An error occurred while downloading and sending audio.', m);
        }
    } else {
        await conn.reply(m.chat, "Invalid sequence number. Please select a number corresponding to the list above.", m);
    }
};

handler.help = ['sps *<text>*'];
handler.tags = ['search'];
handler.command = /^sps$/i;
handler.limit = true;

export default handler;

async function spotifydl(url) {
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`);
        const json = response.data;

        if (!json || !json.status || !json.download) {
            throw new Error('Failed to fetch Spotify data. Ensure the URL is correct.');
        }

        return { download: json.download };
    } catch (error) {
        console.error('Error downloading Spotify song:', error);
        throw new Error('Error downloading Spotify song.');
    }
}

async function searchSpotify(query) {
    try {
        const response = await axios.get(`https://api.agatz.xyz/api/spotify?message=${encodeURIComponent(query)}`);
        const json = response.data;

        if (!json || !json.data || json.data.length === 0) {
            throw new Error('No results found for your query.');
        }

        return json.data.map(item => ({
            name: item.trackName,
            artists: item.artistName,
            link: item.externalUrl,
            image: item.imageUrl,
            duration_ms: item.duration_ms,
        }));
    } catch (error) {
        console.error('Error searching Spotify:', error);
        throw new Error('Error searching Spotify.');
    }
}