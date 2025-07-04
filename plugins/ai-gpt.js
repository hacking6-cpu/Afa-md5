import axios from "axios";

const handler = async (m, { text }) => {
    if (!text) return m.reply('Tanya Apa');
    
    const { data } = await axios.get("https://fgsi1-restapi.hf.space/api/ai/copilot", { params: { text }});
    if (!data?.data?.answer) return m.reply('Gagal Dapat Responnya');
    
    m.reply(data?.data?.answer || 'Gak Ada Respon');
};

handler.help = ['gpt'];
handler.command = ['gpt'];
handler.tags = ['ai'];

export default handler;