import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';

class Uptodown {
    constructor(text) {
        this.baseUrl = "https://id.uptodown.com";
        this.text = text;
    }

    async search() {
        return axios.post(this.baseUrl + "/android/search", { q: this.text }).then((response) => {
            const $ = load(response.data);
            let result = [];
            $('.content .name a').each((_, a) => {
                let _slug = $(a).attr('href');
                let _name = $(a).text().trim();
                result.push({
                    name: _name,
                    slug: _slug.replace("." + this.baseUrl.replace("https://", "") + "/android", "").replace("https://", "")
                });
            });
            return result;
        }).catch((e) => {
            console.error(e);
            throw e;
        });
    }

    async download() {
        return axios.get("https://" + this.text + "." + this.baseUrl.replace("https://", "") + "/android").then(async (response) => {
            const $ = load(response.data);
            let image = [];
            let obj = {};
            let v = $('.detail .icon img');
            obj.title = v.attr('alt').replace("Ikon ", "") || "None";
            let slug = $('a.button.last').attr('href');
            obj.version = $('.info .version').text().trim() || "None";
            const downloadData = await this.getDownloadData(slug, obj.version);
            obj.download = downloadData || "None";
            obj.author = $('.autor').text().trim() || "None";
            obj.score = $('span[id="rating-inner-text"]').text().trim() || "None";
            obj.unduhan = $('.dwstat').text().trim() || "None";
            obj.icon = v.attr('src') || "None";
            $('.gallery picture img').each((_, a) => {
                image.push($(a).attr('src'));
            });
            obj.image = image || [];
            obj.desc = $('.text-description').text().trim().split('\n')[0] || "None";
            return obj;
        }).catch((e) => {
            console.error(e);
            throw e;
        });
    }

    async getDownloadData(slug, version) {
        try {
            const response = await axios.get(slug);
            const downloadUrl = `https://dw.uptodown.net/dwn/${load(response.data)('.button-group.download button').attr('data-url')}${version}.apk`;
            const { headers } = await axios.head(downloadUrl);
            const downloadSize = headers["content-length"];
            return { size: downloadSize, url: downloadUrl };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

// Handler untuk Bot WhatsApp
const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return m.reply("Masukkan nama aplikasi untuk mencari.");
    }

    const query = args.join(" ");
    const uptodown = new Uptodown(query);

    try {
        // Pencarian aplikasi
        const results = await uptodown.search();
        if (results.length === 0) {
            return m.reply("Aplikasi tidak ditemukan.");
        }

        // Pilih hasil pertama
        const app = results[0];
        uptodown.text = app.slug;

        // Ambil detail aplikasi
        const details = await uptodown.download();

        // Kirim hasil detail dengan icon
        const message = `
*Title:* ${details.title}
*Version:* ${details.version}
*Author:* ${details.author}
*Score:* ${details.score}
*Unduhan:* ${details.unduhan}
*Deskripsi:* ${details.desc}

*Download:* ${details.download.url} (Size: ${details.download.size} bytes)
        `.trim();

        // Kirim icon
        const iconBuffer = await axios.get(details.icon, { responseType: 'arraybuffer' }).then(res => res.data);
        await conn.sendMessage(m.chat, { image: Buffer.from(iconBuffer), caption: message }, { quoted: m });

        // Kirim gambar satu per satu
        for (const img of details.image) {
            const imgBuffer = await axios.get(img, { responseType: 'arraybuffer' }).then(res => res.data);
            await conn.sendMessage(m.chat, { image: Buffer.from(imgBuffer) }, { quoted: m });
        }

        // Unduh file APK
        const apkBuffer = await axios.get(details.download.url, { responseType: 'arraybuffer' }).then(res => res.data);
        const fileName = `${details.title}-${details.version}.apk`;
        const filePath = path.join('/tmp', fileName);
        fs.writeFileSync(filePath, apkBuffer);

        // Kirim file APK
        await conn.sendMessage(m.chat, { document: { url: filePath }, mimetype: 'application/vnd.android.package-archive', fileName }, { quoted: m });

        // Hapus file APK setelah dikirim
        fs.unlinkSync(filePath);

    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat mengambil data.");
    }
};

// Properti command
handler.help = ['uptodown'].map(v => v + ' <nama aplikasi>');
handler.command = /^(uptodown)$/i;
handler.limit = false;

export default handler;