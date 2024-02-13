const { Message, MessageMedia } = require('whatsapp-web.js');
const got = require('got');

class Module {
    /** @type {string[]} */
    command = ['!meme'];

    /** @type {string[]} */
    description = ['This command sends a random meme from reddit, optionally you can send the subreddit\'s name from which you want meme.']

    /**
     * @param {Client} client
     * @param {Message} msg
     */

    async operate(client, msg) {
        let subreddit = '';
        let meme_api = "https://meme-api.com/gimme/meme/50";

        const regxmatch = msg.body.match(/!meme (.+)/);
        if (regxmatch) {
            subreddit = regxmatch[1].split(' ')[0];
            meme_api = `https://meme-api.com/gimme/${subreddit}/50`
        }

        // use https://github.com/D3vd/Meme_Api for fetching memes
        const res = await got(meme_api);

        if (res.statusCode < 200 || res.statusCode > 299) {
            throw `failed meme-api request: ${res.statusCode}`;
        }

        let body = JSON.parse(res.body);

        if (body.code === 404) {
            msg.reply(
                `subreddit ${subreddit} doesn't exists !`,
                msg.from
            );
            return;
        }

        body = body['memes'][Math.floor(Math.random()*body['memes'].length)]

        // filter out spoilers and nsfw, also Client.sendMessage doesn't support gif files
        if (body.url.slice(-3) === 'gif') {
            return "retry";
        }

        const media = await MessageMedia.fromUrl(body.url, {unsafeMime: true});
        await client.sendMessage(
            msg.from,
            media,
            { caption: body.title }
        );
        return body.url;
    };

}

module.exports = Module