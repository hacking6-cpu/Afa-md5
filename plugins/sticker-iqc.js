let handler = async (m, { conn, text }) => {

  if (!text) return m.reply('Mana Text Nya')

  if (text.length > 80) return m.reply('Max 80 Text')

  

  conn.sendMessage(m.chat, {

    image: { url: 'https://flowfalcon.dpdns.org/imagecreator/iqc?text=' + encodeURIComponent(text) },

  }, { quoted: m })

}

 

handler.help = ['iqc <teks>']

handler.command = ['iqc']

handler.taga = ['sticker']

 

export default handler