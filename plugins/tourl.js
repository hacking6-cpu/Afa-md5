import crypto from "crypto";
import fs from 'fs';
import axios from 'axios';
import fetch from 'node-fetch'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
const { proto, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')). default

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (!mime || mime == 'conversation') return m.reply('apa yang mau di upload ?')
        let media = await q.download();
        let link = await catbox(media);

        let shortLink = await shortUrl(link);

        let caption = `╭─ 「 UPLOAD SUCCESS 」
📂 Size: ${media.length} Byte
🌍 URL 1: ${link || "Not Found"}
🔗 Short URL: ${shortLink || "Not Found"}
📌 Expired: Unknown
╰───────────────`;

        let thumbnail = await prepareWAMessageMedia(
            { image: { url: link } },
            { upload: conn.waUploadToServer }
        );

        let msg = {
            interactiveMessage: proto.Message.InteractiveMessage.create({
                header: proto.Message.InteractiveMessage.Header.create({
                    hasMediaAttachment: true,
                    ...thumbnail
                }),
                body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "Tekan tombol di bawah untuk menyalin tautan."
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Copy Catbox",
                                copy_code: link || "Not Found"
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Copy Short Link",
                                copy_code: shortLink || "Not Found"
                            })
                        }
                    ]
                })
            })
        };

        await conn.relayMessage(m.chat, msg, { messageId: m.key.id });

    } catch (error) {
        conn.reply(m.chat, `Error: ${error.message || error}`, m);
    }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i
handler.limit = 3; handler.comand = 3
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

/**
 * @param {string}
 * @returns {Promise<string>}
 */
async function shortUrl(url) {
    try {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error();
        return await res.text();
    } catch {
        return url;
    }
}

/**
 * upload to catbox
 */
async function catbox(buffer) {
    const { ext, mime } = (await fileTypeFromBuffer(buffer)) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error();
    return await res.text();
}