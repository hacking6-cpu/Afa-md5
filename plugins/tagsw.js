import pkg from '@adiwajshing/baileys';
const { default: makeWASocket, ...Baileys } = pkg;

// Fungsi mentionStatus
async function mentionStatus(conn, groupId, content, type = 'text') {
    let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
    let fonts = [0, 1, 2, 6, 7, 8, 9, 10];

    // Ambil data anggota grup
    let groupMetadata = await conn.groupMetadata(groupId);
    let users = groupMetadata.participants.map(u => u.id);

    if (type === 'text') {
        await conn.sendMessage(
            "status@broadcast",
            { 
                text: content, 
                mentions: users 
            },
            {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                font: fonts[Math.floor(Math.random() * fonts.length)],
            }
        );
    } else if (type === 'audio' || type === 'video' || type === 'image') {
        const mediaMessage = type === 'audio' ? { audio: content } :
                            type === 'video' ? { video: content } : { image: content };
        await conn.sendMessage(
            "status@broadcast",
            { ...mediaMessage, mentions: users },
            {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                font: fonts[Math.floor(Math.random() * fonts.length)],
            }
        );
    }
}

// Handler untuk command
const handler = async (m, { conn, text, isGroup, isMedia, quotedMsg }) => {
    // Memastikan hanya bekerja di grup
    if (!m.isGroup || !m.chat.endsWith('@g.us')) {
        return m.reply('Perintah ini hanya bisa digunakan di dalam grup!');
    }

    const groupId = m.chat;

    const args = text.split(' ');
    const content = args.join(' ');

    if (!content && !isMedia && !quotedMsg?.isMedia) {
        return m.reply('Mohon masukkan konten status yang valid.');
    }

    if (isMedia || quotedMsg?.isMedia) {
        const mediaMsg = isMedia ? m : quotedMsg;
        const mediaType = mediaMsg.mimetype.startsWith('image') ? 'image' :
                          mediaMsg.mimetype.startsWith('video') ? 'video' : 'audio';

        try {
            const mediaBuffer = await conn.downloadMediaMessage(mediaMsg);
            await mentionStatus(conn, groupId, mediaBuffer, mediaType);
            m.reply('Status dengan media berhasil diunggah dan grup disebut!');
        } catch (err) {
            console.log(err);
            m.reply('Terjadi kesalahan saat mengirim status dengan media.');
        }
    } else {
        try {
            await mentionStatus(conn, groupId, content, 'text');
            m.reply('Status berhasil diunggah dan grup disebut!');
        } catch (err) {
            console.log(err);
            m.reply('Terjadi kesalahan saat mengirim status.');
        }
    }
};

handler.help = ['tagsw'];
handler.command = /^(tagsw)$/i;
handler.limit = false;

export default handler;