import fetch from 'node-fetch';
 
let handler = async (m, { conn, text }) => { try { if (!text) throw '❌ Error\nLogs error : Harap masukkan pertanyaan!';
 
let res = await fetch(`https://www.velyn.biz.id/api/ai/LilyAI?prompt=${encodeURIComponent(text)}`);
    let json = await res.json();
    if (!json || !json.data || !json.data.data) throw `❌ Error\nLogs error : ${json.data?.msg || 'Respon tidak valid'}`;
 
    let message = `🤖 *LilySexyy AI* \n\n${json.data.data}`;
 
    conn.reply(m.chat, message, m, {
        contextInfo: {
            externalAdReply: {
                title: 'Lily Sexyy💦',
                body: 'jawaban dari Lily',
                thumbnailUrl: 'https://files.catbox.moe/jqifhy.jpg',
                sourceUrl: 'https://nekopoi.care',
                mediaType: 1,
                renderLargerThumbnail: false, 
                showAdAttribution: true
            }
        }
    });
} catch (err) {
    conn.reply(m.chat, `❌ Error\nLogs error : ${err}`, m);
}
 
};
 
handler.tags = ['ai']; handler.help = ['lily <pertanyaan>']; handler.command = /^lily$/i;
 
export default handler;