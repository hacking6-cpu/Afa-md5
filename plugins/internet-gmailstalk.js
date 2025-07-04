/*
- [ *PLUGINS STALK GMAIL* ]
- Description: Get any info from gmail

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import fetch from "node-fetch";
import cheerio from "cheerio";

// Thanks for Func - Created by Mizzu

const checkGmail = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const username = email.split('@')[0];
      const response = await fetch('https://gmail-osint.activetk.jp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Postify/1.0.0' // Sesuaikan User-Agent jika diperlukan
        },
        body: new URLSearchParams({
          q: username,
          domain: 'gmail.com'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      const $ = cheerio.load(data);
      const text = $('pre').text();

      const extract = (regex, defaultValue = 'Tidak ada', checkNotFound = false) => {
        const result = (text.match(regex) || [null, defaultValue])[1].trim();
        return checkNotFound && result === 'Not found.' ? 'Tidak ada' : result;
      };

      resolve({
        status: 200,
        result: {
          email: email,
          photoProfile: extract(/Custom profile picture !\s*=>\s*(.*)/, 'Tidak ada'),
          lastEditProfile: extract(/Last profile edit : (.*)/),
          googleID: extract(/Gaia ID : (.*)/),
          userTypes: extract(/User types : (.*)/),
          googleChat: {
            entityType: extract(/Entity Type : (.*)/),
            customerID: extract(/Customer ID : (.*)/, 'Tidak ada', true)
          },
          googlePlus: {
            enterpriseUser: extract(/Entreprise User : (.*)/)
          },
          mapsData: {
            profilePage: extract(/Profile page : (.*)/)
          },
          ipAddress: text.includes('Your IP has been blocked by Google') ? 'Di blokir oleh Google' : 'Aman',
          calendar: text.includes('No public Google Calendar') ? 'Tidak ada' : 'Ada'
        }
      });
    } catch (error) {
      resolve({
        status: 404,
        msg: `Email tidak ditemukan atau terjadi kesalahan! ${error.message}`
      });
    }
  });
};

// ---

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Masukkan email Gmail yang valid\nContoh: *${usedPrefix + command}* shyodev@gmail.com`);
  }

  m.reply("[❗] Wait Anata");

  try {
    const data = await checkGmail(text);

    if (data.status === 404) {
      m.reply(data.msg);
      m.react(rerror);
      return;
    }

    let txt = `
Berikut adalah hasil stalk gmail anda:

> Gmail: ${data.result.email}
> Last edit: ${data.result.lastEditProfile}
> Google ID: ${data.result.googleID}
> Type: ${data.result.userTypes}
> Entity type: ${data.result.googleChat.entityType}
> Costumer ID: ${data.result.googleChat.customerID}
> Enterprise user: ${data.result.googlePlus.enterpriseUser}
> IP Status: ${data.result.ipAddress}
> Calendar: ${data.result.calendar}
> Profile page: ${data.result.mapsData.profilePage}`;

    conn.sendMessage(m.chat, {
        image: { url: data.result.photoProfile },
        caption: txt.trim(),
        contextInfo: {
          externalAdReply: {
            title: `Gmail Stalker`,
            body: global.author,
            thumbnailUrl: data.result.photoProfile,
            sourceUrl: sgc
          }
        }
    }, { quoted: m });
  } catch (error) {
    m.reply(`Error: ${error.message || 'Gagal melakukan pencarian'}`);
  }
};

handler.help = ['gmailstalk <email>'];
handler.tags = ['internet'];
handler.command = /^(gmailstalk)$/i;
handler.limit = true;

export default handler;