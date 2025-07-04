import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function apkdogSearch(query, limit = 3) {
    let response = await axios.get(`https://apk.dog/search/${query}`);
    let $ = cheerio.load(response.data);

    let results = [];
    $("div.wrap ul.apps_list li.item").each(function () {
        let title = $(this).find("a.app_link div.app_name").text().trim();
        let version = $(this).find("div.bottom_block div.version").text().trim().replace("version: ", "");
        let rating = $(this).find("div.bottom_block div.raging").text().trim().replace("rating: ★", "");
        let url = $(this).find("a.app_link").attr("href");

        results.push({
            appName: title,
            appVersion: version,
            ratingCount: rating,
            appUrl: url
        });
    });

    let message = results.slice(0, limit).map(result =>
        `*Nama Aplikasi*\n${result.appName}\n\n` +
        `*Version*\n${result.appVersion}\n\n` +
        `*Rate*\n${result.ratingCount}\n\n` +
        `*Link Download*\n${result.appUrl}`
    ).join('\n\n────────────────────\n\n');

    return {
        message: message || 'Tidak ditemukan aplikasi yang sesuai.',
        imageUrl: "https://files.catbox.moe/ydq939.jpg"
    };
}

async function apkdogDownload(appUrl) {
    try {
        const { data } = await axios.get(appUrl);
        const $ = cheerio.load(data);
        const downloadPageUrl = $('.dwn_btn_wrap a.dwn1').attr('href');

        if (!downloadPageUrl) throw new Error('Link unduhan tidak ditemukan.');

        const { data: downloadPage } = await axios.get(downloadPageUrl);
        const $$ = cheerio.load(downloadPage);
        const finalDownloadUrl = $$('div.dwn_up.top1 .dwn_btn_wrap a.dwn1').attr('href');

        if (!finalDownloadUrl) throw new Error('Link unduhan final tidak ditemukan.');

        const urlParts = new URL(appUrl);
        const fileName = urlParts.hostname.split('.')[0] + '.apk';

        const response = await axios.get(finalDownloadUrl, { responseType: 'stream' });
        const fileSize = response.headers['content-length'];

        if (!fileSize || fileSize < 100000) {
            throw new Error('File terlalu kecil, kemungkinan rusak.');
        }

        const filePath = path.join('/tmp', fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve({ filePath, fileName, fileSize }));
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error('Gagal mengunduh APK: ' + error.message);
    }
}

let handler = async (m, { text, args, conn }) => {
    if (!args.length) return m.reply(`Gunakan format:\n- *apkdog search* <nama aplikasi>\n- *apkdog dl* <URL aplikasi>`);

    let commandType = args[0].toLowerCase();
    let query = args.slice(1).join(' ');

    if (!query) return m.reply(`Masukkan nama aplikasi atau URL.`);

    if (commandType === 'search') {
        m.reply('Mencari aplikasi...');
        let { message, imageUrl } = await apkdogSearch(query);
        
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: message
        }, { quoted: m });
    } else if (commandType === 'dl') {
        m.reply('Sedang mengunduh APK, harap tunggu...');
        try {
            let { filePath, fileName } = await apkdogDownload(query);

            await conn.sendMessage(m.chat, {
                document: fs.readFileSync(filePath),
                mimetype: 'application/vnd.android.package-archive',
                fileName
            }, { quoted: m });

            fs.unlinkSync(filePath);
        } catch (error) {
            m.reply(error.message);
        }
    } else {
        m.reply(`Perintah tidak dikenali! Gunakan:\n- *apkdog search* <nama aplikasi>\n- *apkdog dl* <URL aplikasi>`);
    }
};

handler.help = ['apkdog'];
handler.tags = ['search']
handler.command = ['apkdog'];
handler.limit = false;

export default handler;