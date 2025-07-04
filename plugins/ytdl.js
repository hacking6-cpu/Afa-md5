import axios from "axios";
import { writeFile } from "fs/promises";
import { join } from "path";
import fetch from "node-fetch";

const SUPPORTED_AUDIO_FORMATS = ["mp3", "m4a", "webm", "acc", "flac", "ogg", "wav"];
const SUPPORTED_VIDEO_QUALITIES = {
  low: "360",
  medium: "480",
  hd: "720",
  fullHd: "1080",
  hdHigh: "1440",
  ultraHd: "4k",
};

const ytdl = {
  request: async (url, format, quality) => {
    try {
      if (SUPPORTED_AUDIO_FORMATS.includes(format)) {
        const { data } = await axios.get(
          `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${url}`
        );
        return data;
      } else if (SUPPORTED_VIDEO_QUALITIES[quality]) {
        const { data } = await axios.get(
          `https://p.oceansaver.in/ajax/download.php?format=${SUPPORTED_VIDEO_QUALITIES[quality]}&url=${url}`
        );
        return data;
      } else {
        console.error(
          `Invalid format or quality. Supported formats: ${SUPPORTED_AUDIO_FORMATS.join(
            ", "
          )}, Supported qualities: ${Object.keys(SUPPORTED_VIDEO_QUALITIES).join(", ")}`
        );
      }
    } catch (error) {
      console.error(`Error (request): ${error.message}`);
    }
  },

  convert: async (taskId) => {
    try {
      const { data } = await axios.get(
        `https://p.oceansaver.in/ajax/progress.php?id=${taskId}`
      );
      return data;
    } catch (error) {
      console.error(`Error (convert): ${error.message}`);
    }
  },

  repeatRequest: async (taskId) => {
    while (true) {
      try {
        const response = await ytdl.convert(taskId);
        if (response && response.download_url) {
          return {
            videoLinks: response.download_url,
          };
        }
      } catch (error) {
        console.error(`Error (repeatRequest): ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  },
};

const handler = async (m, { command, args }) => {
  if (!args[0]) return m.reply("Silakan masukkan URL YouTube.\nContoh: .ytdl <url> <format/quality>");

  const url = args[0];
  const formatOrQuality = args[1] || "hd";
  const isAudio = SUPPORTED_AUDIO_FORMATS.includes(formatOrQuality);

  try {
    const response = await ytdl.request(url, isAudio ? formatOrQuality : null, isAudio ? null : formatOrQuality);
    if (!response) return m.reply("Gagal memproses URL. Pastikan URL dan format/kualitas benar.");

    const taskId = response.id;
    const downloadLink = isAudio ? await ytdl.convert(taskId) : await ytdl.repeatRequest(taskId);

    if (downloadLink && downloadLink.videoLinks) {
      const videoUrl = downloadLink.videoLinks;
      const res = await fetch(videoUrl);
      const buffer = await res.buffer();

      const fileName = join(process.cwd(), `${new Date().getTime()}.mp4`);
      await writeFile(fileName, buffer);

      await conn.sendMessage(
        m.chat,
        { video: { url: fileName }, caption: `✅ Berhasil mendownload video dalam resolusi 720p.` },
        { quoted: m }
      );

      setTimeout(() => {
        try {
          fs.unlinkSync(fileName);
        } catch (err) {
          console.error("Gagal menghapus file lokal:", err.message);
        }
      }, 5000);
    } else {
      m.reply("Gagal mendapatkan link download. Coba lagi nanti.");
    }
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan saat memproses permintaan.");
  }
};

handler.help = ["ytdl"].map((v) => v + " <url> <format/quality>");
handler.command = /^(ytdl)$/i;
handler.tags = ["downloader"]
handler.limit = false;

export default handler;