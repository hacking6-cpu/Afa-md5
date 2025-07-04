import axios from "axios";
import FormData from "form-data";

const deepSeekThink = {
   chat: async (question) => {
      let d = new FormData();
      d.append("content", `User: ${question}`);
      d.append("model", "@groq/deepseek-r1-distill-llama-70b");

      let head = {
         headers: {
            ...d.getHeaders(),
         },
      };

      try {
         let { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", d, head);

         console.log("Full API Response:", JSON.stringify(data, null, 2));

         return data.result || data.full_result || JSON.stringify(data);
      } catch (error) {
         console.error("API Error:", error.response?.data || error.message);
         throw new Error("Gagal mengambil jawaban dari AI.");
      }
   }
};

const handler = async (m, { conn, text }) => {
   if (!text) return m.reply("*Mau Tanya Apa?*");

   try {
      const result = await deepSeekThink.chat(text);
      await m.reply(result);
   } catch (error) {
      console.error("Error:", error);
      await m.reply("Error :v");
   }
};

handler.help = ["deepseek"];
handler.tags = ['ai']
handler.command = ["deepseek"];
handler.limit = false;

export default handler;