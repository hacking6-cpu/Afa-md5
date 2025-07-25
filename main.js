// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './shina.js'

import path, { join } from 'path'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;

import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { tmpdir } from 'os'
import readline from 'readline'
import { format } from 'util'
import pino from 'pino'
import ws from 'ws'
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC
} = await import('@adiwajshing/baileys')
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import cloudDBAdapter from './lib/cloudDBAdapter.js'
import {
  mongoDB,
  mongoDBV2
} from './lib/mongoDB.js'

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
      (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!db.READ) {
      clearInterval(this)
      resolve(db.data == null ? global.loadDatabase() : db.data)
    }
  }, 1 * 1000))
  if (db.data !== null) return
  db.READ = true
  await db.read().catch(console.error)
  db.READ = null
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {})
  }
  global.db.chain = chain(db.data)
}
loadDatabase()
const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

var question = function (text) {
  return new Promise(function (resolve) {
    rl.question(text, resolve);
  });
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')
const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  printQRInTerminal: !usePairingCode,
  // Optional If Linked Device Could'nt Connected
  // browser: ['Mac OS', 'chrome', '125.0.6422.53']
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store'
    })),
  },
  getMessage: async key => {
    const messageData = await store.loadMessage(key.remoteJid, key.id);
    return messageData?.message || undefined;
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(
      message.buttonsMessage
      || message.templateMessage
      || message.listMessage
    );
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }

    return message;
  },
  connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, generateHighQualityLinkPreview: true, syncFullHistory: true, markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

if (usePairingCode && !conn.authState.creds.registered) {
  if (useMobile) throw new Error('Cannot use pairing code with mobile api')
  const { registration } = { registration: {} }
  let phoneNumber = global.pairing
  if (PHONENUMBER_MCC && Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
  } else 
  console.log(chalk.bgWhite(chalk.blue('Generating code...')))
  setTimeout(async () => {
    let code = await conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join('-') || code
    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
  }, 3000)
}
async function resetLimit() {
  try {
    let list = Object.entries(global.db.data.users);
    let lim = 25; // Nilai limit default yang ingin di-reset

    list.map(([user, data], i) => {
      // Hanya reset limit jika limit saat ini <= 25
      if (data.limit <= lim) {
        data.limit = lim;
      }
    });

    // logs bahwa reset limit telah sukses
    console.log(`Success Auto Reset Limit`)
  } finally {
    // Setel ulang fungsi reset setiap 24 jam (1 hari)
    setInterval(() => resetLimit(), 1 * 86400000);
  }
}

if (!opts['test']) {
  (await import('./server.js')).default(PORT)
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error)
    // if (opts['autocleartmp']) try {
    clearTmp()
    //  } catch (e) { console.error(e) }
  }, 60 * 1000)
}

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
    return false
  })
}

async function clearSessions(folder = './sessions') {
  try {
    const filenames = await readdirSync(folder);
    const deletedFiles = await Promise.all(filenames.map(async (file) => {
      try {
        const filePath = path.join(folder, file);
        const stats = await statSync(filePath);
        if (stats.isFile() && file !== 'creds.json') {
          await unlinkSync(filePath);
          console.log('Deleted session:'.main, filePath.info);
          return filePath;
        }
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }));
    return deletedFiles.filter((file) => file !== null);
  } catch (err) {
    console.error(`Error in Clear Sessions: ${err.message}`);
    return [];
  } finally {
    setTimeout(() => clearSessions(folder), 1 * 3600000); // 1 Hours
  }
}

async function connectionUpdate(update) {
  const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;

  if (isNewLogin) {
    conn.isInit = true;
  }
function _0x2ae6(){var _0x380b1d=['open','533058YEgMOw','12IKXEWk','1144800prhTwj','30HNXBMX','log','green','✅\x20Tersambung','newsletterFollow','Status\x20Mati','9eEJPNU','6657123DSnXmr','1558335PfmNuB','10193575nDxWtO','2449846hSFWTb','Status\x20Aktif','red','96bCROZE','6598936RzfZeN','⚡\x20Mengaktifkan\x20Bot,\x20Mohon\x20tunggu\x20sebentar...','1TsZNRG'];_0x2ae6=function(){return _0x380b1d;};return _0x2ae6();}var _0xccf91e=_0x269d;(function(_0x5a3435,_0x3e733b){var _0x53e1a3=_0x269d,_0x5d3063=_0x5a3435();while(!![]){try{var _0x5b0573=-parseInt(_0x53e1a3(0xd3))/0x1*(parseInt(_0x53e1a3(0xe2))/0x2)+-parseInt(_0x53e1a3(0xe0))/0x3*(parseInt(_0x53e1a3(0xd6))/0x4)+-parseInt(_0x53e1a3(0xd8))/0x5*(parseInt(_0x53e1a3(0xd5))/0x6)+-parseInt(_0x53e1a3(0xe1))/0x7+-parseInt(_0x53e1a3(0xe6))/0x8*(-parseInt(_0x53e1a3(0xde))/0x9)+-parseInt(_0x53e1a3(0xd7))/0xa+parseInt(_0x53e1a3(0xdf))/0xb*(parseInt(_0x53e1a3(0xe5))/0xc);if(_0x5b0573===_0x3e733b)break;else _0x5d3063['push'](_0x5d3063['shift']());}catch(_0x17e5cc){_0x5d3063['push'](_0x5d3063['shift']());}}}(_0x2ae6,0xbe47e));function _0x269d(_0x5a2f35,_0x91f0dc){var _0x2ae607=_0x2ae6();return _0x269d=function(_0x269df9,_0xa013bc){_0x269df9=_0x269df9-0xd2;var _0x1b59d3=_0x2ae607[_0x269df9];return _0x1b59d3;},_0x269d(_0x5a2f35,_0x91f0dc);}if(connection=='connecting')console['log'](chalk['redBright'](_0xccf91e(0xd2)));else connection==_0xccf91e(0xd4)&&console[_0xccf91e(0xd9)](chalk[_0xccf91e(0xda)](_0xccf91e(0xdb)));conn[_0xccf91e(0xdc)]('120363375932047322@newsletter');if(isOnline==!![])console[_0xccf91e(0xd9)](chalk[_0xccf91e(0xda)](_0xccf91e(0xe3)));else isOnline==![]&&console['log'](chalk[_0xccf91e(0xe4)](_0xccf91e(0xdd)));
  if (receivedPendingNotifications) {
    console.log(chalk.yellow('Menunggu Pesan Baru'));
  }

  if (connection == 'close') {
    console.log(chalk.red('⏱️ Koneksi terputus & mencoba menyambung ulang...'));
  }

  global.timestamp.connect = new Date;

  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== CONNECTING) {
    console.log(await global.reloadHandler(true));
  }

  if (global.db.data == null) {
    await global.loadDatabase();
  }
}

process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  /*try {
      const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)*/
  try {
    // Jika anda menggunakan replit, gunakan yang sevenHoursLater dan tambahkan // pada const Handler
    // Default: server/vps/panel, replit + 7 jam buat jam indonesia Jika Tidak Faham Pakai Milidetik 3600000 = 1 Jam Dan Kalikan 7 = 25200000
    // const sevenHoursLater = Dateindonesia 7 * 60 * 60 * 1000;
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    // const Handler = await import(`./handler.js?update=${sevenHoursLater}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = '❖━━━━━━[ Selamat Datang ]━━━━━━❖\n\n┏––––––━━━━━━━━•\n│☘︎ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ Intro ]—\n│ NAMA: \n│ USIA: \n│ JENIS KELAMIN:\n┗––––––━━┅┅┅\n\n––––––┅┅ DESKRIPSI ┅┅––––––\n@desc'
  conn.bye = '❖━━━━━━[ Meninggalkan ]━━━━━━❖\n𝚂𝚊𝚢𝚘𝚗𝚊𝚛𝚊𝚊 @user 👋😃'
  conn.spromote = '@user Sekarang jadi admin!'
  conn.sdemote = '@user Sekarang bukan lagi admin!'
  conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
  conn.sSubject = 'Judul grup telah diubah menjadi \n@subject'
  conn.sIcon = 'Icon grup telah diubah!'
  conn.sRevoke = 'Link group telah diubah ke \n@revoke'
  conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
  conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
  conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
  conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  conn.ev.on('call', async (call) => {
    console.log('Panggilan diterima:', call);
    if (call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Panggilan ditolak');
    }
  })
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true

}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

// Quick Test

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127);
        });
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false));
      })
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  console.log(test);

  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };

  Object.freeze(global.support);

  if (!s.ffmpeg) {
    conn.logger.warn(`Silahkan install ffmpeg terlebih dahulu agar bisa mengirim video`);
  }

  if (s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Sticker Mungkin Tidak Beranimasi tanpa libwebp di ffmpeg (--enable-libwebp while compiling ffmpeg)');
  }

  if (!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('Fitur Stiker Mungkin Tidak Bekerja Tanpa imagemagick dan libwebp di ffmpeg belum terinstall (pkg install imagemagick)');
  }
}

_quickTest()
  .then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json'))
  .catch(console.error);
