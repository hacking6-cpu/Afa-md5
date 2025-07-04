import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(" Masukkan pesan untuk Mie-AI!");

  try {
    await conn.sendMessage(m.chat, {
      react: { text: "🌸", key: m.key }
    });

    let apiUrl = `https://api.simplebot.my.id/api/tools/openai?prompt=sekarang%20kamu%20adalah%20MieChan-AI&msg=${encodeURIComponent(text)}`;
    let { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      return m.reply("❌ Gagal mendapatkan respons dari Mie-AI.");
    }

    let replyMsg = `🤖 *MieChan-AI Chatbot*\n\n` +
                   `💬 *Pertanyaan:* ${text}\n` +
                   `🧠 *Jawaban:* ${data.result}\n\n` +
                   `🔖 *Created by:* MieChan AI`;

    m.reply(replyMsg);

    await conn.sendMessage(m.chat, {
      react: { text: "☑️", key: m.key }
    });

  } catch (error) {
    console.error(error);
    m.reply("❌ Terjadi kesalahan saat menghubungi MieChan-AI.");
  }
};

// Handler bot
handler.help = ['miechan <pesan>'];
handler.tags = ['ai'];
handler.command = ["miechan", "ai"];

export default handler;;