import fs from 'fs'

import path from 'path'

const dbDir = path.resolve('./lib') // Pastikan folder lib ada

const antiTagSWPath = path.join(dbDir, 'antitagsw.json') // Lokasi database

// Pastikan folder database ada sebelum digunakan

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

// Fungsi untuk memuat data dari file JSON

const loadAntiTagSW = () => {

    try {

        if (!fs.existsSync(antiTagSWPath)) fs.writeFileSync(antiTagSWPath, '{}', 'utf-8')

        return JSON.parse(fs.readFileSync(antiTagSWPath, 'utf-8'))

    } catch (error) {

        console.error("Gagal membaca database AntiTagSW:", error)

        return {}

    }

}

// Fungsi untuk menyimpan data ke file JSON

const saveAntiTagSW = (data) => {

    try {

        fs.writeFileSync(antiTagSWPath, JSON.stringify(data, null, 4), 'utf-8')

    } catch (error) {

        console.error("Gagal menyimpan database AntiTagSW:", error)

    }

}

// Inisialisasi database Anti Tag Status WhatsApp

let antiTagSWGroup = loadAntiTagSW()

let handler = async (m, { conn, args, isAdmin, isOwner }) => {

    if (!m.isGroup) return m.reply("Fitur ini hanya bisa digunakan di grup.")

    if (!(isAdmin || isOwner)) return m.reply("Anda bukan admin, tidak bisa mengatur ini.")

    if (!args[0]) return m.reply("Gunakan: .antitagsw on/off")

    let status = args[0].toLowerCase()

    if (!["on", "off"].includes(status)) {

        return m.reply("Format salah! Gunakan: .antitagsw on/off")

    }

    if (status === "on") {

        antiTagSWGroup[m.chat] = true

        saveAntiTagSW(antiTagSWGroup)

        return m.reply("Anti Tag Status WhatsApp sekarang AKTIF di grup ini!")

    } else {

        delete antiTagSWGroup[m.chat]

        saveAntiTagSW(antiTagSWGroup)

        return m.reply("Anti Tag Status WhatsApp dimatikan di grup ini.")

    }

}

// Handler sebelum pesan diproses (untuk mendeteksi tag grup di status WhatsApp)

handler.before = async (m, { conn, isAdmin }) => {

    if (!m.isGroup || !antiTagSWGroup[m.chat]) return

    let sender = m.sender

    let chat = global.db.data.chats[m.chat] || {}

    let isFromStatus = m.key.remoteJid === 'status@broadcast'

    let isBroadcast = !!m.message?.senderKeyDistributionMessage

    let isMessageStub = [25, 29].includes(m.messageStubType) // Status Update

    let isTaggedGroup = m.message?.contextInfo?.mentionedJid?.some(jid => jid.endsWith('@g.us'))

    let hasQuotedGroupTag = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.some(jid => jid.endsWith('@g.us'))

    let hasMedia = !!m.message?.imageMessage || !!m.message?.videoMessage

    let hasStatusContext = m.message?.messageContextInfo?.messageSecret

    // Jika pengirim adalah admin, abaikan pesan

    if (isAdmin) return

    // **Perbaikan utama:** Abaikan pesan media yang bukan dari status/broadcast

    if (hasMedia && !isFromStatus && !isBroadcast) return

    if (isFromStatus || isBroadcast || isMessageStub || isTaggedGroup || hasQuotedGroupTag || hasStatusContext) {

        let warnsData = chat.warns || {}

        warnsData[sender] = (warnsData[sender] || 0) + 1

        chat.warns = warnsData

        global.db.data.chats[m.chat] = chat

        let warns = warnsData[sender]

        let maxWarns = chat.maxwarn || 2

        let warningMessage = `ðŸš¨ Grup ini telah ditandai di status!\n\n` +

                             `@${sender.split("@")[0]}, jangan tag grup di status lagi! Anda sudah mendapat ${warns}/${maxWarns} peringatan.`

        await conn.sendMessage(m.chat, { text: warningMessage, mentions: [sender] })

        // Hapus pesan pengguna

        try {

            await conn.sendMessage(m.chat, { delete: m.key })

        } catch (error) {

            console.error("Gagal menghapus pesan status:", error)

        }

    }

}

// Menentukan perintah untuk mengaktifkan/mematikan fitur

handler.command = ['antitagsw']

handler.group = true

handler.admin = true

export default handler