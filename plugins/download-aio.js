import axios from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";

class Aio {
    async getTokens() {
        let { data: tkns } = await axios.get("https://steptodown.com/");
        let $ = cheerio.load(tkns);
        return $("#token").val();
    }

    async request(urls) {
        let tkns = await this.getTokens();
        let d = new FormData();
        d.append("url", urls);
        d.append("token", tkns);

        let headers = {
            headers: {
                ...d.getHeaders()
            }
        };

        let { data: result } = await axios.post("https://steptodown.com/wp-json/aio-dl/video-data/", d, headers);
        return result;
    }
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Masukkan URL!");

    let aio = new Aio();
    let res;

    try {
        res = await aio.request(text);
    } catch (e) {
        return m.reply("Terjadi kesalahan.");
    }

    if (!res || !res.medias || res.medias.length === 0) {
        return m.reply("Media tidak ditemukan.");
    }

    let { thumbnail, medias } = res;
    let media = medias[0];

    if (media.extension.includes("mp4")) {
        conn.sendMessage(m.chat, { video: { url: media.url } });
    } else if (media.extension.includes("mp3") || media.extension.includes("audio")) {
        conn.sendMessage(m.chat, { audio: { url: media.url }, mimetype: "audio/mp4" });
    } else {
        conn.sendMessage(m.chat, { image: { url: thumbnail } });
    }
};

handler.help = ["aio"];
handler.tags = ['downloader']
handler.command = ["aio"];

export default handler;