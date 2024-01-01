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
		const regxmatch = msg.body.match(/!meme (.+)/);
		if (regxmatch) {
			subreddit = regxmatch[1].split(' ')[0];
		}

		// use https://github.com/D3vd/Meme_Api for fetching memes
		let meme_api = "https://meme-api.com/gimme/";

		try {
			let requestMeme = async () => {
				try {
					const res = await got(meme_api+subreddit);

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

					// filter out spoilers and nsfw, also Client.sendMessage doesn't support gif files
					if (body.nsfw == true || body.spoiler == true || body.url.slice(-3) === 'gif') {
						return "retry";
					}

					const media = await MessageMedia.fromUrl(body.url);
					await client.sendMessage(
						msg.from,
						media,
						{ caption: body.title }
					);
					return body.url;
				} catch (error) {
					throw error;
				}
			};

			let counter = 0;
			const MAX_RETRIES = 5;
			while (counter++ < MAX_RETRIES && await requestMeme() === 'retry');

			if (counter >= MAX_RETRIES) {
				throw "too much retries!!";
			}
		} catch (err) {
			console.error("meme-api error: ", err);
			msg.reply(
				"Sorry couldn't fulfill your request right now :(", 
				msg.from
			);
		}
	}
}

module.exports = Module
