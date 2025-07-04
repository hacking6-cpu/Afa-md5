import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';
import fetch from 'node-fetch';
import FormData from 'form-data';

const RemoveBG = {
    async request() {
        const clientId = uuidv4();
        const url = 'https://api-int.retoucher.online/api/v4/Request/Create';
        const form = new FormData();
        form.append('clientId', clientId);
        form.append('country', 'ID');
        form.append('timezone', 'GMT+0700');
        const headers = { ...form.getHeaders(), 'accept': 'application/json' };

        const response = await fetch(url, { method: 'POST', headers, body: form });
        if (!response.ok) throw new Error(await response.text());
        return { ...(await response.json()), id: clientId };
    },

    async remove(bufferGambar, session) {
        const url = 'https://api-int.retoucher.online/api/v4/Request/Upload';
        const image = await Jimp.read(bufferGambar);
        const width = image.getWidth();
        const height = image.getHeight();
        const sizeInKB = Math.floor(bufferGambar.length / 1024);

        const form = new FormData();
        form.append('clientId', session.id);
        form.append('country', 'ID');
        form.append('timezone', 'GMT+0700');
        form.append('requestId', session.requestId);
        form.append('size', sizeInKB);
        form.append('width', width.toString());
        form.append('height', height.toString());
        form.append('ratio', (width / height).toFixed(2));
        form.append('processingMethod', 'V1Accelerated');
        form.append('image', bufferGambar, { filename: 'image.jpeg', contentType: 'image/jpeg' });
        const headers = { ...form.getHeaders(), 'accept': 'application/json' };

        const response = await fetch(url, { method: 'POST', headers, body: form });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        return Buffer.from(data.result.split(',')[1], 'base64');
    },

    async render(originalBuffer, maskBuffer) {
        const original = await Jimp.read(originalBuffer);
        const mask = await Jimp.read(maskBuffer);
        mask.resize(original.getWidth(), original.getHeight());
        original.mask(mask, 0, 0);
        return original;
    }
};

let handler = async (m, { conn, usedPrefix }) => {
    let bufferGambar;

    // Cek jika user balas gambar atau kirim gambar dengan caption command
    if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.includes('image')) {
        bufferGambar = await m.quoted.download();
    } else if (m.mimetype && m.mimetype.includes('image')) {
        bufferGambar = await m.download();
    } else {
        return m.reply(`Kirim atau balas gambar dengan caption *${usedPrefix}removebg*`);
    }

    try {
        let session = await RemoveBG.request();
        let maskBuffer = await RemoveBG.remove(bufferGambar, session);
        let finalImage = await RemoveBG.render(bufferGambar, maskBuffer);
        let hasilBuffer = await finalImage.getBufferAsync(Jimp.MIME_PNG);
        
        await conn.sendMessage(m.chat, { image: hasilBuffer, caption: "✅ Background berhasil dihapus!" }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply("❌ Terjadi kesalahan saat menghapus background.");
    }
};

handler.help = ['removebg'];
handler.command = ['removebg'];
handler.limit = false;

export default handler;