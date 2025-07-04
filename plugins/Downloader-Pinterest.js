import axios from 'axios';
import cheerio from 'cheerio';

class Pinterest {
    search = async function (query) {
        const queryParams = {
                source_url: "/search/pins/?q=" + encodeURIComponent(query),
                data: JSON.stringify({
                    options: {
                        isPrefetch: !1,
                        query: query,
                        scope: "pins",
                        no_fetch_context_on_resource: !1,
                    },
                    context: {},
                }),
                _: Date.now(),
            },
            url = new URL("https://www.pinterest.com/resource/BaseSearchResource/get/");
        Object.entries(queryParams).forEach((entry) =>
            url.searchParams.set(entry[0], entry[1])
        );
        try {
            const json = await (await fetch(url.toString())).json();
            return json.resource_response.data.results
                .filter((a) => a.title !== "")
                .map((a) => ({
                    title: a.title,
                    id: a.id,
                    create_at: new Date(a.created_at * 1).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    author: a.pinner.username,
                    followers: a.pinner.follower_count.toLocaleString(),
                    source: "https://www.pinterest.com/pin/" + a.id,
                    image: a.images["orig"].url,
                }));
        } catch (error) {
            console.error("Error mengambil data:", error);
            return [];
        }
    };

    download = async function (url) {
        try {
            let response = await axios
                .get(url, {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                    },
                })
                .catch((e) => e.response);
            let $ = cheerio.load(response.data);
            let tag = $('script[data-test-id="video-snippet"]');
            if (tag.length > 0) {
                let result = JSON.parse(tag.text());
                if (
                    !result ||
                    !result.name ||
                    !result.thumbnailUrl ||
                    !result.uploadDate ||
                    !result.creator
                ) {
                    return {
                        msg: "- Data tidak ditemukan, coba pakai url lain",
                    };
                }
                return {
                    title: result.name,
                    thumb: result.thumbnailUrl,
                    upload: new Date(result.uploadDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    source: result["@id"],
                    author: {
                        name: result.creator.alternateName,
                        username: "@" + result.creator.name,
                        url: result.creator.url,
                    },
                    keyword: result.keywords
                        ? result.keywords.split(", ").map((keyword) => keyword.trim())
                        : [],
                    download: result.contentUrl,
                };
            } else {
                let json = JSON.parse(
                    $("script[data-relay-response='true']").eq(0).text()
                );
                let result = json.response.data["v3GetPinQuery"].data;
                return {
                    title: result.title,
                    upload: new Date(result.createAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    source: result.link,
                    author: {
                        name: result.pinner.username,
                        username: "@" + result.pinner.username,
                    },
                    keyword: result.pinJoin.visualAnnotation,
                    download: result.imageLargeUrl,
                };
            }
        } catch (e) {
            return {
                msg: "Error coba lagi nanti",
            };
        }
    };
}

const handler = async (m, { conn, args }) => {
    const pinterest = new Pinterest();

    if (!args[0]) return m.reply("Masukkan kata kunci atau URL yang valid.");

    if (args[0].startsWith("http")) {
        // Mode download
        const result = await pinterest.download(args[0]);
        if (result.msg) return m.reply(result.msg);

        await conn.sendMessage(m.chat, {
            caption: `📌 *Title*: ${result.title}\n📅 *Uploaded*: ${result.upload}\n🔗 *Source*: ${result.source}\n👤 *Author*: ${result.author.name}`,
            image: { url: result.download }, // Kirim gambar dari URL download
        });
    } else {
        // Mode search
        const results = await pinterest.search(args.join(" "));
        if (results.length < 5)
            return m.reply("Tidak cukup hasil ditemukan (minimal 5 gambar).");

        const limitedResults = results.slice(0, 10); // Maksimal 10 gambar

        m.reply(`Ditemukan ${results.length} hasil. Mengirimkan hingga 10 gambar...`);

        for (const res of limitedResults) {
            await conn.sendMessage(m.chat, {
                caption: `📌 *Title*: ${res.title}\n👤 *Author*: ${res.author}\n🔗 *Source*: ${res.source}`,
                image: { url: res.image }, // Kirim gambar dari URL gambar
            });
        }
    }
};

handler.help = ["pin2"].map((v) => v + " <query/url>");
handler.tags = ['search']
handler.command = /^pin2$/i;
handler.limit = false;

export default handler;
