/*
Jangan Hapus Wm Bang 

*Github Search Repo Plugins Esm*

Aslinya Untuk Next Bisa Di Pake In Button Tapi yg Pake Business....

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11/1391
*/

import axios from 'axios';

const userSearches = new Map();

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const userId = m.sender;
 
  if (m.text && m.text.toLowerCase() === 'next') {
    if (!userSearches.has(userId)) {
      return m.reply('❌ No active search found. Please start a new search first.');
    }

    const userData = userSearches.get(userId);
    const nextPage = userData.currentPage + 1;
    const totalPages = Math.ceil(userData.data.result.length / 5);

    if (nextPage > totalPages) {
      return m.reply('❌ You have reached the end of the search results.');
    }

    userData.currentPage = nextPage;
    userSearches.set(userId, userData);

    return displayResults(m, conn, userData.data, nextPage);
  }
  
  if (!text) return m.reply(`Example: ${usedPrefix + command} scraper`);

  m.reply('🔍 Searching repositories...');
  
  try {
    const data = await GithubRepo(text);
    
    if (data.count === 0) {
      return m.reply('❌ Repository not found!');
    }

    userSearches.set(userId, {
      data: data,
      currentPage: 1,
      query: text,
      timestamp: Date.now()
    });

    displayResults(m, conn, data, 1);

    setTimeout(() => {
      if (userSearches.has(userId)) {
        userSearches.delete(userId);
      }
    }, 30 * 60 * 1000); // 30 minutes
    
  } catch (error) {
    console.error(error);
    m.reply('❌ Error fetching repository data. Please try again later.');
  }
};

function displayResults(m, conn, data, page) {
  const startIndex = (page - 1) * 5;
  const endIndex = Math.min(startIndex + 5, data.result.length);
  const results = data.result.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.result.length / 5);

  let responseText = `*GITHUB REPOSITORY SEARCH*\n`;
  responseText += `📊 Found: ${data.count} repositories\n`;
  responseText += `📃 Page: ${page} of ${totalPages}\n\n`;

  results.forEach((repo, index) => {
    responseText += `🔖 *Repository ${startIndex + index + 1}*\n`;
    responseText += `📝 *Name:* ${repo.name_repo}\n`;
    responseText += `👤 *Full Name:* ${repo.full_name_repo}\n`;
    responseText += `🔗 *URL:* ${repo.url_repo}\n`;
    responseText += `📋 *Description:* ${repo.description || 'No description'}\n`;
    responseText += `⭐ *Stars:* ${repo.stargazers}\n`;
    responseText += `🍴 *Forks:* ${repo.forks}\n`;
    responseText += `👁️ *Watchers:* ${repo.watchers}\n`;
    responseText += `🔤 *Language:* ${repo.language || 'Not specified'}\n`;
    responseText += `🔒 *Private:* ${repo.is_private ? 'Yes' : 'No'}\n`;
    responseText += `🔁 *Is Fork:* ${repo.is_fork ? 'Yes' : 'No'}\n`;
    responseText += `🌿 *Default Branch:* ${repo.default_branch}\n`;
    responseText += `📅 *Created:* ${formatDate(repo.created_at)}\n`;
    responseText += `🔄 *Updated:* ${formatDate(repo.updated_at)}\n`;
    responseText += `📤 *Pushed:* ${formatDate(repo.pushed_at)}\n`;
    responseText += `📁 *Clone URL:* ${repo.clone_url}\n`;
    responseText += `🖥️ *Git URL:* ${repo.git_url}\n`;
    responseText += `🔐 *SSH URL:* ${repo.ssh_url}\n`;
    
    if (repo.homepage) {
      responseText += `🏠 *Homepage:* ${repo.homepage}\n`;
    }
    
    responseText += `\n`;
  });

  if (page < totalPages) {
    responseText += `_Ketik *next* untuk melihat hasil selanjutnya_`;
  } else {
    responseText += `_End of search results_`;
  }

  conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
}

async function GithubRepo(repo) {
  return new Promise(async (resolve, reject) => {
    await axios.get(`https://api.github.com/search/repositories?q=${repo}`)
      .then(response => {
        if (response.status == 200) {
          const results = response.data.items;
          let data = {};
          data.count = response.data.total_count;
          data.result = [];
          if (data.count != 0) {
            results.forEach((res) => {
              data.result.push({
                id: res.id,
                node_d: res.node_id,
                name_repo: res.name,
                full_name_repo: res.full_name,
                url_repo: res.html_url,
                description: res.description,
                git_url: res.git_url,
                ssh_url: res.ssh_url,
                clone_url: res.clone_url,
                svn_url: res.svn_url,
                homepage: res.homepage,
                stargazers: res.stargazers_count,
                watchers: res.watchers,
                forks: res.forks,
                default_branch: res.default_branch,
                language: res.language,
                is_private: res.private,
                is_fork: res.fork,
                created_at: res.created_at,
                updated_at: res.updated_at,
                pushed_at: res.pushed_at,
              });
            });
          } else {
            data.items = "Repositories not found";
          }
          resolve(data);
        } else {
          reject({
            code: 404,
            message: "Internal Server Error, Repeat in a few more moments, if there is still an error, please contact the coder"
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

handler.command = /^(github|gitrepo)$/i;
handler.help = ['github', 'gitrepo'];
handler.tags = ['internet', 'tools'];
handler.limit = false;

handler.before = async (m) => {
  if (m.text.toLowerCase() === 'next') {
    return handler(m, { conn: global.conn, text: '', args: [], usedPrefix: '', command: '' });
  }
};

export default handler;