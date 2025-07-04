import ws from "ws";

export class HuggingFace {
  base_url;
  url_ident;
  constructor() {
    this.base_url = [
      "https://ori-muchim-bluearchivetts.hf.space/",
      "wss://zomehwh-vits-models.hf.space/queue/join",
      "wss://zomehwh-vits-models-pcr.hf.space/queue/join",
      "wss://zomehwh-vits-models-genshin-bh3.hf.space/queue/join",
    ];
    this.url_ident = {
      bAV: 0,
      vMV: 1,
    };
  }

  async blueArchiveVoice(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let { text, model = "Airi", speed = 1.2 } = data;
        if (!text || text.length >= 500)
          throw new Error(`Make sure to enter valid text, that's not exceed 500 words!`);
        if (speed && (speed < 0.1 || speed > 2)) speed = 2;
        model = "JP_" + model;
        const url = this.base_url[this.url_ident.bAV];
        const session_hash = this.generateSession();
        const socket = new ws(url.replace("https", "wss") + "queue/join");
        socket.on("message", (data) => {
          const d = JSON.parse(data.toString("utf8"));
          switch (d.msg) {
            case "send_hash": {
              socket.send(JSON.stringify({ fn_index: 0, session_hash }));
              break;
            }
            case "send_data": {
              socket.send(
                JSON.stringify({
                  fn_index: 0,
                  session_hash,
                  data: [text, model, speed],
                })
              );
              break;
            }
            case "process_completed": {
              if (!d.success)
                throw new Error(`Error failed generating : ${JSON.stringify(d, null, 2)}`);
              const o = d.output;
              const name = o.data[1]?.name;
              socket.close();
              return resolve({
                text,
                model,
                speed,
                result: {
                  duration: +o.duration.toFixed(2),
                  path: name,
                  url: url + "file=" + name,
                },
              });
            }
          }
        });
      } catch (e) {
        return reject(`Error in voice ${data} ${e}`);
      }
    });
  }

  async vitsModelVoice(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let { text, lang = "japanese", model = "kafka", game = null } = data;
        if (!text || text.length >= 100)
          throw new Error("Enter valid text! with length more than 0 and less than 100!");
        lang = lang.toLowerCase();
        model = model.toLowerCase();
        const gameId = game ? game.toLowerCase() : null;

        const url = this.base_url[gameId ? this.pVitsModelVoiceGame[gameId] : this.url_ident.vMV];
        const session_hash = this.generateSession();
        const socket = new ws(url);
        const fn_index = this.pVitsModelVoiceModelIdent[gameId ? gameId : "normal"][model];
        socket.on("message", (data) => {
          const d = JSON.parse(data.toString("utf8"));
          switch (d.msg) {
            case "send_hash": {
              socket.send(JSON.stringify({ fn_index, session_hash }));
              break;
            }
            case "send_data": {
              socket.send(
                JSON.stringify({
                  fn_index,
                  session_hash,
                  data: [text, lang, 0.6, 0.668, 1, false],
                })
              );
              break;
            }
            case "process_completed": {
              if (!d.success)
                throw new Error(`Error failed generating : ${JSON.stringify(d, null, 2)}`);
              const o = d.output;
              socket.close();
              return resolve({
                text,
                lang,
                model,
                game: gameId || null,
                result: {
                  data: Buffer.from(o.data[1].split(",")[1], "base64"),
                  duration: +o.duration.toFixed(2),
                },
              });
            }
          }
        });
      } catch (e) {
        return reject(`Error in vitsModelVoice : ${e}`);
      }
    });
  }

  generateSession() {
    return Math.random().toString(36).substring(2);
  }
}

const handler = async (m, { text, command, conn }) => {
  const hf = new HuggingFace();
  let result;

  try {
    if (command === "bluearchivevoice") {
      const [textInput, model = "Airi", speed = 1.2] = text.split("|").map((v) => v.trim());
      if (!textInput) return m.reply("Masukkan teks yang valid!");

      result = await hf.blueArchiveVoice({ text: textInput, model, speed });

      await conn.sendMessage(
        m.chat,
        { audio: { url: result.result.url }, mimetype: "audio/mpeg" },
        { quoted: m }
      );

      
      await m.reply(`✅ Audio berhasil dihasilkan! 
Model: ${result.model}
Durasi: ${result.result.duration}s`);
    }
  } catch (err) {
    m.reply(`❌ Terjadi kesalahan: ${err.message}`);
  }
};

handler.help = ["bluearchivevoice"].map((v) => v + " <teks|model|speed>");
handler.tags = ["ai"]
handler.command = /^(bluearchivevoice)$/i;
handler.limit = false;

export default handler;
