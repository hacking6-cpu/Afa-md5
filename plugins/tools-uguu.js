import axios from 'axios';
import FormData from 'form-data';

async function Uguu(buffer, filename) {
    try {
        const form = new FormData();
        form.append('files[]', buffer, { filename });

        const { data } = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders(),
        });

        if (data.files && data.files[0]) {
            return {
                name: data.files[0].name,
                url: data.files[0].url,
                size: data.files[0].size,
            };
        } else {
            throw new Error('Upload gagal.');
        }
    } catch (err) {
        throw `Terjadi kesalahan saat upload: ${err.message}`;
    }
}

let handler = async (m, { conn }) => {
    try {
        await m.react('⌛');

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image/') && !mime.startsWith('video/') && !mime.startsWith('audio/')) 
            throw 'Silakan kirim atau reply *gambar, video, atau audio* untuk diupload.';

        let media = await q.download();
        let ext = mime.split('/')[1];
        let filename = `upload.${ext}`;

        let result = await Uguu(media, filename);

        await m.react('✅');

        let caption = `*Link Akan Expired 3 Jam* 
        
*${result.url}*`;

        await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    } catch (error) {
        await m.react('❌');
        await conn.sendMessage(m.chat, { text: `❌ *Error:* ${error}` }, { quoted: m });
    }
};

handler.help = ['uguu'];
handler.tags = ['tools']
handler.command = ['uguu'];
handler.limit = false;

export default handler;