import fs from 'fs'
import moment from 'moment-timezone'

let handler = m => m
handler.all = async function (m) {
    let name = await conn.getName(m.sender)
    let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
    try {
        pp = await this.profilePictureUrl(m.sender, 'image')
    } catch (e) {
    } finally {

        //global.bg = await (await fetch(img)).buffer()
        global.doc = pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"])

        // Module 
        global.fetch = (await import('node-fetch')).default
        global.bochil = await import('@bochilteam/scraper')
        global.fs = fs

        const _uptime = process.uptime() * 1000


        // ucapan ini mah
        global.ucapan = ucapan()

        // pesan sementara
        global.ephemeral = '86400' // 86400 = 24jam, kalo ingin di hilangkan ganti '86400' jadi 'null' atau ''

        // externalAdReply atau text with thumbnail. gatau bahasa Inggris? coba translate!
        global.adReply = {
            contextInfo: {
                mentionedJid:[m.sender], 
                forwardingScore: 9999,
                //isForwarded: true, // ini biar ada tulisannya diteruskan berkali-kali, jika ingin di hilangkan ganti true menjadi false
                externalAdReply: { // Bagian ini sesuka kalian berkreasi :'v
                    showAdAttribution: true,
                    title: global.ucapan,
                    body: wm,
                    mediaUrl: sgw,
                    description: namebot,
                    previewType: "PHOTO",
                    thumbnail: fs.readFileSync('./thumbnail.jpg'),
                    //thumbnail: await (await fetch(pp)).buffer(),
                    sourceUrl: sgw,
                }
            }
        }
        global.sig = {
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: global.ucapan,
                    body: wm,
                    thumbnailUrl: pp,
                    sourceUrl: sig
                }
            }
        }
        global.sfb = {
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: global.ucapan,
                    body: wm,
                    thumbnailUrl: pp,
                    sourceUrl: sfb
                }
            }
        }
        // Fake 🤥
        global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: wm, orderTitle: wm, sellerJid: '0@s.whatsapp.net' } } }
        global.fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': wm, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': fs.readFileSync('./thumbnail.jpg'), thumbnail: fs.readFileSync('./thumbnail.jpg'), sendEphemeral: true } } }
        global.fvn = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ?
                    { remoteJid: "6282127487538-1625305606@g.us" } : {})
            },
            message: {
                "audioMessage": {
                    "mimetype": "audio/ogg; codecs=opus",
                    "seconds": "999999999999",
                    "ptt": "true"
                }
            }
        }

        global.ftextt = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ?
                    { remoteJid: "6282127487538-1625305606@g.us" } : {})
            },
            message: {
                "extendedTextMessage": {
                    "text": wm,
                    "title": wm,
                    'jpegThumbnail': fs.readFileSync('./thumbnail.jpg')
                }
            }
        }

        global.fliveLoc = {
            key:
            {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ?
                    { remoteJid: "status@broadcast" } : {})
            },
            message: { "liveLocationMessage": { "caption": "by : Shyo", "h": `${wm}`, 'jpegThumbnail': fs.readFileSync('./thumbnail.jpg') } }
        }

        global.fliveLoc2 = {
            key:
            {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ?
                    { remoteJid: "status@broadcast" } : {})
            },
            message: { "liveLocationMessage": { "title": "Shyo", "h": wm, 'jpegThumbnail': fs.readFileSync('./thumbnail.jpg') } }
        }

        global.ftoko = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6282176642989@s.whatsapp.net" } : {})
            },
            message: {
                "productMessage": {
                    "product": {
                        "productImage": {
                            "mimetype": "image/jpeg",
                            "jpegThumbnail": fs.readFileSync('./thumbnail.jpg') //Gambarnye
                        },
                        "title": wm, //Kasih namalu 
                        "description": "Simple Bot Esm",
                        "currencyCode": "USD",
                        "priceAmount1000": "20000000",
                        "retailerId": "Ghost",
                        "productImageCount": 1
                    },
                    "businessOwnerJid": `0@s.whatsapp.net`
                }
            }
        }

        global.fdocs = {
            key: {
                participant: '0@s.whatsapp.net'
            },
            message: {
                documentMessage: {
                    title: wm,
                    jpegThumbnail: fs.readFileSync('./thumbnail.jpg')
                }
            }
        }

        global.fgclink = {
            "key": {
                "fromMe": false,
                "participant": "0@s.whatsapp.net",
                "remoteJid": "0@s.whatsapp.net"
            },
            "message": {
                "groupInviteMessage": {
                    "groupJid": "6282127487538-1625305606@g.us",
                    "inviteCode": "null",
                    "groupName": "Shiroko",
                    "caption": wm,
                    'jpegThumbnail': fs.readFileSync('./thumbnail.jpg')
                }
            }
        }

        global.fgif = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(m.chat ?
                    { remoteJid: "6282127487538-1625305606@g.us" } : {})
            },
            message: {
                "videoMessage": {
                    "title": wm,
                    "h": `Hmm`,
                    'seconds': '999999999',
                    'gifPlayback': 'true',
                    'caption': wm,
                    'jpegThumbnail': fs.readFileSync('./thumbnail.jpg')
                }
            }
        }
    }
}

export default handler

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Oyasuminasai Senpai🪷"
    if (time >= 4) {
        res = "Ohayou Gozaimasu Senpai🌿"
    }
    if (time > 10) {
        res = "Konnichiwa Senpai🍂"
    }
    if (time >= 15) {
        res = "Konnichiwa Senpai🌾"
    }
    if (time >= 18) {
        res = "Konbanwa Senpai🍃"
    }
    return res
}

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}
