import * as cheerio from 'cheerio'

const handler = async (m, { conn }) => {

  const msg = await m.reply('Mengambil waktu dari https://time.is/id/Jakarta ...')

  try {

    const { data } = await axios.get('https://time.is/id/Jakarta')

    const $ = cheerio.load(data)

    const lokasi = $('#msgdiv b').text().trim()

    const tanggal = $('#dd').text().trim()

    const jam = $('#clock0_bg').text().trim()

    const now = new Date()

    const jamFallback = now.toLocaleTimeString('id-ID', { hour12: false, timeZone: 'Asia/Jakarta' })

    const teks = `*Waktu di Jakarta Sekarang*\n\n` +

      `*Lokasi:* ${lokasi || 'Jakarta'}\n` +

      `*Tanggal:* ${tanggal || 'Tidak ditemukan'}\n` +

      `*Jam:* ${jam || jamFallback}`

    await m.reply(teks)

  } catch (err) {

    console.error(err)

    await m.reply('Gagal mengambil data dari time.is Jakarta')

  }

}

handler.help = ['timeis']

handler.tags = ['tools']

handler.command = ['timeis','jam']

export default handler