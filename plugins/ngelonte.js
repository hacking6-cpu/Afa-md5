let handler = async (m, { conn }) => {

    let __timers = (new Date - global.db.data.users[m.sender].lastlont);

    let _timers = (500000 - __timers);  // 500000ms cooldown

    let timers = clockString(_timers);

    let user = global.db.data.users[m.sender];

    if (new Date - global.db.data.users[m.sender].lastlont > 500000) {

        let hsl = `Kamu Terbaring Lemas Karna Melakukan Skidipapap 24 Jam Tetapi Kamu Mendapatkan:\nUang: Rp.300000\nExp: 10000\nEmas: 1\nDan Gratis Boba + Nasi Padang`;

        global.db.data.users[m.sender].money += 300000;

        global.db.data.users[m.sender].exp += 10000;

        global.db.data.users[m.sender].gold += 1;

        // Send the initial message

        let initialMessage = await conn.reply(m.chat, `Sedang Mencari Pelanggan`, m);

        // Messages to be sent and edited progressively

        let messages = [

            `Sedang Mencari Pelanggan`,

            `Kamu Mendapatkan Pelanggan Dan Pergi Ke Hotel`,

            `Kamu Mulai Melakukan Skidipapap Dengannya`,

            `Kamu Di Paksa Untuk Melayaninya 24 Jam`,

            hsl

        ];

        // Loop to send and edit messages with delays

        for (let i = 0; i < messages.length; i++) {

            await new Promise(resolve => setTimeout(resolve, i === 0 ? 0 : 5000)); // Delay between each message, 5 seconds for the rest

            await conn.sendMessage(m.chat, { text: messages[i], edit: initialMessage.key });

        }

        // Update the last activity timestamp

        user.lastlont = new Date * 1;

    } else {

        conn.reply(m.chat, `*Kamu Sudah Kecapekan*\n*Silahkan Istirahat Dulu Selama* ${timers}`, m);

    }

};

handler.help = ['ngelont'];

handler.tags = ['rpg'];

handler.command = /^(ngelont)$/i;

handler.group = true;

export default handler;

// Function to format the cooldown time

function clockString(ms) {

    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);

    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;

    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;

    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;

    return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');

}