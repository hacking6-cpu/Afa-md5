let handler = async (m, { conn }) => {

    let __timers = (new Date - global.db.data.users[m.sender].lastngojek);

    let _timers = (300000 - __timers); // 5-minute cooldown

    let order = global.db.data.users[m.sender].ojekk;

    let timers = clockString(_timers);

    let name = conn.getName(m.sender);

    let user = global.db.data.users[m.sender];

    

    if (new Date - global.db.data.users[m.sender].lastngojek > 300000) {

        let randomaku1 = `${Math.floor(Math.random() * 10)}`;

        let randomaku2 = `${Math.floor(Math.random() * 10)}`;

        let randomaku4 = `${Math.floor(Math.random() * 5)}`;

        let randomaku3 = `${Math.floor(Math.random() * 10)}`;

        let randomaku5 = `${Math.floor(Math.random() * 10)}`;

        let rbrb1 = (randomaku1 * 2);

        let rbrb2 = (randomaku2 * 10); 

        let rbrb3 = (randomaku3 * 1);

        let rbrb4 = (randomaku4 * 15729);

        let rbrb5 = (randomaku5 * 20000);

        var zero1 = `${rbrb1}`;

        var zero2 = `${rbrb2}`;

        var zero3 = `${rbrb3}`;

        var zero4 = `${rbrb4}`;

        var zero5 = `${rbrb5}`;

        var dimas = `Mendapatkan Pelanggan....`;

        var dimas2 = `Mulai Menyepong.....`;

        var dimas3 = `Ahhhh, Sakitttt!! >////< Crotttt.....`;

        var dimas4 = `Ahhhhhh....`;

        var hsl = `

        Hasil Ngewe ${name}

        Uang: ${zero4}

        Exp: ${zero5}

        Warn: 1

        Order Selesai: 1

        Total Order Sebelumnya: ${order}

        `;

        // Update user's stats

        global.db.data.users[m.sender].warn += 1;

        global.db.data.users[m.sender].money += rbrb4;

        global.db.data.users[m.sender].exp += rbrb5;

        global.db.data.users[m.sender].ojekk += 1;

        // Send initial message and store its key

        let initialMessage = await m.reply('Mencari Pelanggan.....');

        // List of messages to update with delay

        let messages = [dimas, dimas2, dimas3, dimas4, hsl];

        for (let i = 0; i < messages.length; i++) {

            await new Promise(resolve => setTimeout(resolve, (i + 1) * 5000)); // Delay 5 seconds for each message

            await conn.sendMessage(m.chat, { text: messages[i], edit: initialMessage.key });

        }

        // Update the last task timestamp

        user.lastngojek = new Date * 1;

    } else {

        conn.reply(m.chat, `Sepertinya Kamu Sudah Kecapekan Silahkan Istirahat Dulu Selama\n*${timers}*`, m);

    }

};

handler.help = ['ngewe'];

handler.tags = ['rpg'];

handler.command = /^(ngewe|anu)$/i;

handler.register = true;

handler.premium = true;

export default handler;

function clockString(ms) {

    let h = Math.floor(ms / 3600000);

    let m = Math.floor(ms / 60000) % 60;

    let s = Math.floor(ms / 1000) % 60;

    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');

}