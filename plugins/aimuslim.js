import axios from 'axios';
import { translate } from 'bing-translate-api';

async function muslimai(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        
        const translatedQuery = await translate(query, 'id', 'en');
        const englishQuery = translatedQuery.translation;

        const searchData = { query: englishQuery };
        const searchResponse = await axios.post(searchUrl, searchData, { headers });
        const passages = searchResponse.data.map(item => item.content).join('\n\n');
        
        const answerUrl = 'https://www.muslimai.io/api/answer';
        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer: ${englishQuery}\n\n${passages}`
        };
        const answerResponse = await axios.post(answerUrl, answerData, { headers });

        const translatedAnswer = await translate(answerResponse.data, 'en', 'id');
     
        const translatedSources = await Promise.all(
            searchResponse.data.map(async (item) => {
                const translatedSource = await translate(item.content, 'en', 'id');
                return translatedSource.translation;
            })
        );

        const result = {
            answer: translatedAnswer.translation,
            source: translatedSources
        };

        return result;
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        throw new Error('Terjadi kesalahan saat mengambil data. Mohon coba lagi.');
    }
}

const handler = async (m, { text }) => {
    if (!text) {
        return m.reply('Mohon masukkan pertanyaan.');
    }
    try {
        const result = await muslimai(text);

        const sources = result.source
            .map((item, index) => `${index + 1}. ${item}`)
            .join('\n\n');
        const replyMessage = `*Jawaban:*\n${result.answer}\n\n*Sumber:*\n${sources}`;

        m.reply(replyMessage);
    } catch (error) {
        m.reply(error.message);
    }
};

handler.help = ['muslimai'];
handler.tags = ]'ai']
handler.command = ['muslimai'];

export default handler;