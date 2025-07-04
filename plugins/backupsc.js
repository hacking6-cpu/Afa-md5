/* By ShyoCanPikawcu

*Plugins :* *BackupScript*

*Cr :*

https://whatsapp.com/channel/0029VavBc6uHAdNdbgCgOK0k

*/

import { promisify } from "util"

import cp, { exec as _exec } from "child_process"

import fs from 'fs';

const handler = async (m, { conn }) => {

        await m.reply('sbr')

        let exec = promisify(_exec).bind(cp)

        let { stdout } = await exec("zip -r tmp/backup.zip * -x 'node_modules/*'")

        if (stdout) conn.sendMessage(m.sender, { document: await fs.readFileSync("./tmp/backup.zip"), fileName: "Mahiru Asisten.zip", mimetype: "application/zip", caption: "Successfully backed up the script [ ✅ ]" }, { quoted: m })

        fs.unlinkSync("./tmp/backup.zip")

    }

handler.help = ["backup"];

handler.tags = ["owner"];

handler.command = /^(backup)$/i;

handler.owner = true;

export default handler