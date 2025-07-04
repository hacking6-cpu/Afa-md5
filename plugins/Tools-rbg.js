import axios from "axios";

async function removebg(buffer) {
    try {
        return await new Promise(async (resolve, reject) => {
            const image = buffer.toString("base64");
            let res = await axios.post(
                "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
                    image: `data:image/png;base64,${image}`,
                    model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
                },
            );
            const data = res.data?.replace(`"`, "");
            console.log(res.status, data);
            if (!data) return reject("failed removebg image");
            resolve(data);
        });
    } catch (e) {
        return {
            msg: e
        };
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted || !m.quoted.download) {
        return m.reply(`Balas sebuah gambar dengan perintah *${usedPrefix}${command}* untuk menghapus background.`);
    }

    try {
        const buffer = await m.quoted.download();
        const result = await removebg(buffer);

        if (typeof result === 'string') {
            await conn.sendMessage(m.chat, { image: { url: result }, caption: "Berhasil menghapus latar belakang!" }, { quoted: m });
        } else {
            throw result.msg || "Gagal menghapus latar belakang.";
        }
    } catch (err) {
        console.error(err);
        m.reply(`Terjadi kesalahan: ${err.msg || err}`);
    }
};

handler.help = ['removebg'].map(v => v + ' ');
handler.command = /^(removebg|rbg)$/i;
handler.limit = false;

export default handler;
