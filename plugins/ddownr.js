import axios from 'axios';
import fs from 'fs';
import path from 'path';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

class ddownr {
    download = async function (url, format) {
        if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
            throw new Error('Format tidak didukung. Silakan cek daftar format yang tersedia.');
        }

        const config = {
            method: 'GET',
            url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        try {
            const response = await axios.request(config);

            if (response.data && response.data.success) {
                const { id, title, info } = response.data;
                const { image } = info;
                const downloadUrl = await this.cekProgress(id);

                return {
                    id: id,
                    image: image,
                    title: title,
                    downloadUrl: downloadUrl
                };
            } else {
                throw new Error('Gagal mendapatkan detail video.');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    cekProgress = async function (id) {
        const config = {
            method: 'GET',
            url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        try {
            while (true) {
                const response = await axios.request(config);

                if (response.data && response.data.success && response.data.progress === 1000) {
                    return response.data.download_url;
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
}

const handler = async (m, { conn, text, args }) => {
    if (!args[0]) {
        return m.reply('Silakan masukkan URL yang valid.\n\nContoh:\n.namadownloader https://www.youtube.com/watch?v=example mp3');
    }

    const url = args[0];
    const format = args[1];

    if (!format) {
        return m.reply('Silakan masukkan format yang diinginkan.\n\nFormat Audio:\nmp3, m4a, webm, acc, flac, opus, ogg, wav\n\nFormat Video:\n360, 480, 720, 1080, 1440, 4k');
    }

    try {
        const ddownrInstance = new ddownr();
        const result = await ddownrInstance.download(url, format);

        const { id, image, title, downloadUrl } = result;

        const caption = `
*Berhasil Mendapatkan Link Download!*
*Judul*: ${title}
*ID*: ${id}
*Format*: ${format}
`.trim();

        // Mengunduh video dari downloadUrl
        const filePath = path.resolve('./', `${title}.${format === 'mp3' ? 'mp3' : 'mp4'}`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream',
        });

        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Mengirim video ke WhatsApp
        await conn.sendMessage(m.chat, { video: fs.readFileSync(filePath), caption: caption }, { quoted: m });

        // Hapus file setelah terkirim
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error(error);
        m.reply('Gagal memproses permintaan Anda. Pastikan URL dan format yang dimasukkan sudah benar.');
    }
};

handler.help = ['ddownr'].map((v) => v + ' <url> <format>');
handler.command = /^(ddownr|download)$/i;
handler.limit = false;

export default handler;
