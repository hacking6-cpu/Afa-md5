import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

async function QwenAi(messages, { model, chatType, sessionId } = {}) {
const validChatTypes = {
"chat": "t2t",
"search": "search"
};

const validModels = {  
    "1": "qwen-plus-latest",  
    "2": "qwen-max-latest",  
    "3": "qwen-turbo-latest",  
    "4": "qwen2.5-72b-instruct",  
    "5": "qwen2.5-14b-instruct",  
    "6": "qwen2.5-7b-instruct",  
    "7": "qwen2.5-4b-instruct",  
    "8": "qwen2.5-1.8b-instruct",  
    "9": "qwen2.5-vl-72b-instruct"  
};  

chatType = validChatTypes[chatType] || "t2t";  
model = validModels[model] || "qwen-plus-latest";  

try {  
    const response = await axios({  
        method: 'post',  
        url: 'https://chat.qwenlm.ai/api/chat/completions',  
        headers: {  
            'authority': 'chat.qwenlm.ai',  
            'accept': '*/*',  
            'accept-language': 'en-ID,en;q=0.9,id-ID;q=0.8,id;q=0.7,ja-ID;q=0.6,ja;q=0.5,zh-ID;q=0.4,zh;q=0.3,ko-ID;q=0.2,ko;q=0.1,en-GB;q=0.1,en-US;q=0.1',  
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhM2ZkNTc4LWQxYWMtNDE0Yy1hNDFkLWU1MDY0ODFmMjZiZSIsImV4cCI6MTc0MTE1ODE4OX0._lJXrrbLScouc1cmfivw8mpp5kAqMN4DnQvPR4XR2JY',  
            'bx-v': '2.5.0',  
            'content-type': 'application/json',  
            'cookie': 'acw_tc=2b8093d9e2533765e0e44f471ed300ab5b4d688b129cb2b27ad4445a46a09adb; x-ap=ap-southeast-5; cna=GlgnINyglDACAbYB65/rpalj; _gcl_au=1.1.2055392080.1738566168.948113384.1738566185.1738566184; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhM2ZkNTc4LWQxYWMtNDE0Yy1hNDFkLWU1MDY0ODFmMjZiZSIsImV4cCI6MTc0MTE1ODE4OX0._lJXrrbLScouc1cmfivw8mpp5kAqMN4DnQvPR4XR2JY; xlly_s=1; SERVERID=06653d79d03d6b74416117fffb239b3f|1738566225|1738566166; SERVERCORSID=06653d79d03d6b74416117fffb239b3f|1738566225|1738566166; ssxmod_itna=GuGQ1D7K0KGKi7G7DgBDwxEGR7I4GHDy6xYK0CDmxjKidPDUeMm43xCq0QqDc00YOGeKWKDRxqkDBT4NikDBFdDoxGYi6CWYxAxgKRT+eIPUrrR24tW8EGb5yKu7LRecsLI6q5GRpqeDQxi8ixi1DG5DGDxDRxikD7vi1x4DxxGTDCeGDWW+DGbpDYPD=xDdob3eD0IG6moNPm3DqaDfDleD0PcIoRoDTp7tRDi33poDXhQDv6SKotPWHDqAwb32Gmv8G0P4CH5YWm0ioWGBl6Ptlmi4gWU=OqNHm8qs+OTYtQeYoujuid=7io2AmkC5M0pCWDojw7hDnYhiGwK/w4mwkBPU0q3ih5Cw4edi0qxD; ssxmod_itna2=GuGQ1D7K0KGKi7G7DgBDwxEGR7I4GHDy6xYK0CDmxjKidPDUeMm43xCq0QqDc00YOGeKWKDRxqiD8S7q593ix03gRaifqvDBkGnebwf=fHfonIa3NfttLIxaz8uE/Ka38LG16BXt08F+LRONo/80fn83xODNoDLQlfLNon+hXQQxzDED5l2Kf0rfkB2XznSLAzLTcmAa3+u2W2+5y7LX4zdvFxdh42qdCxcrKRgWGZkaE48G+1nxtvpUkQKhx50hXfiMsLFfLVR5wszizRoMrkK7R=Hnvb0fejeNqt=LgN1nYEQhqSgtoB2nByD0wqjPPDnCG4YbDqHYt9hN7ixR2=7Fq2YYADYQb4eD; isg=BJWV1DORXnTpqHqI7a-gwocppJNPkkmkawaxdhc6VYxbbr1g2eP-drFoPSz-vmFc; tfstk=gLpt5X2Wzf8uZz6oIAGhmblK5ionHKKwdF-7nZbgGeLplFiann1gl-LpR1fj_CYdkwT8hIcqu9tBowFb5ZsXpMTJyZ1s_V5CDwjWsZiNlZBCciU_ht9vT-Ky0dmNncWwbtWjr4DkHh-N3TddwjJOA6sXA5w1hXXBTTLuB4DoEhThWTfZrdD-MBbOcts1GZaIvijPct1ffHidci4_GRTXADQF0Zab1R1QRiSTCt6Xlwid0ws6D7nPuS_3HQHrzmKuSxy43pIO6ZNC7-FKmNCOrH6uVu9LU1QWfwemyydVHNsWF2VN21K6Z_dafRKBfQ8VVFasW6-52FC9HVH5I9_wWG5URqSpO38VVFGqlEWNcE5yn4yN5ntyUQX-HSWfGgPeELhtSzjFp5nKvSPV1MJJrZ3elju77MQoxsN4g1hPvamKvSPV1MSdrDlYgS5ta',  
            'origin': 'https://chat.qwenlm.ai',  
            'referer': 'https://chat.qwenlm.ai/c/e4fbd10a-6746-4fe0-ac2d-4e0e4c131740',  
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',  
            'sec-ch-ua-mobile': '?1',  
            'sec-ch-ua-platform': '"Android"',  
            'sec-fetch-dest': 'empty',  
            'sec-fetch-mode': 'cors',  
            'sec-fetch-site': 'same-origin',  
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',  
            'x-request-id': uuidv4()  
        },  
        data: {  
            "stream": false,  
            "chat_type": chatType,  
            "model": model,  
            "messages": messages.map(msg => ({ role: msg.role || 'user', content: msg.content })),  
            "session_id": sessionId || uuidv4(),  
            "chat_id": uuidv4(),  
            "id": uuidv4()  
        }  
    });  

    return response.data.choices[0].message.content;  
} catch (error) {  
    return error.message;  
}

}

const handler = async (m, { text, usedPrefix, command }) => {
const args = text.trim().split(' ');
const subcommand = args[0]?.toLowerCase();
const userMessage = args.slice(1).join(' ');

let defaultModel = '1'; 

if (subcommand === 'set') {  
    const model = args[1];  
    if (!model) return m.reply(`Contoh: ${usedPrefix}${command} set 2\nPilih model:\n1. qwen-plus-latest\n2. qwen-max-latest\n3. qwen-turbo-latest\n4. qwen2.5-72b-instruct\n5. qwen2.5-14b-instruct\n6. qwen2.5-7b-instruct\n7. qwen2.5-4b-instruct\n8. qwen2.5-1.8b-instruct\n9. qwen2.5-vl-72b-instruct`);  
    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(model)) return m.reply('Model tidak valid! Pilih angka 1-9.');  
    defaultModel = model;  
    return m.reply(`Model default berhasil diubah ke: ${defaultModel}`);  
}  

// Subcommand: search  
if (subcommand === 'search') {  
    if (!userMessage) return m.reply('Tulis pesan untuk mode pencarian!');  
    const systemMsg = {  
        role: 'system',  
        content: `Nama kamu Ivy, pakai emoji ":3, ;3, :p, :0, :]" saja. Gaya bicara cute & gaul!`  
    };  
    try {  
        const response = await QwenAi(  
            [systemMsg, { role: 'user', content: userMessage }],  
            { model: defaultModel, chatType: 'search' }  
        );  
        await m.reply(response);  
    } catch (error) {  
        await m.reply(`Error: ${error.message}`);  
    }  
    return;  
}  

// Subcommand: chat (default)  
if (!subcommand || subcommand === 'chat') {  
    if (!userMessage) return m.reply('Tulis pesan untuk Ivy!');  
    const systemMsg = {  
        role: 'system',  
        content: `Nama kamu Ivy, pakai emoji ":3, ;3, :p, :0, :]" saja. Gaya bicara cute & gaul!`  
    };  
    try {  
        const response = await QwenAi(  
            [systemMsg, { role: 'user', content: userMessage }],  
            { model: defaultModel, chatType: 'chat' }  
        );  
        await m.reply(response);  
    } catch (error) {  
        await m.reply(`Error: ${error.message}`);  
    }  
    return;  
}  

m.reply(`Subcommand tidak valid! Gunakan:\n- ${usedPrefix}${command} chat [pesan]\n- ${usedPrefix}${command} search [pesan]\n- ${usedPrefix}${command} set [model]`);

};

handler.help = ['ivy'];
handler.tags = ['ai']
handler.command = /^(ivy)$/i;
handler.limit = false;

export default handler;