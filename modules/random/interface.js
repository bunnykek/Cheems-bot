const { Message, MessageMedia, Client } = require('whatsapp-web.js');
const got = require('got');
require('dotenv').config()

class Module {
	/** @type {string} */
	name = 'Random'

	/** @type {string} */
	description = 'For fetching random memes, songs and anime characters.'

	/** @type {JSON} */
	commands = {
		'rmeme': `Random meme.\n${process.env.PREFIX}rmeme [n]`,
		'rsong': `Random music.\n${process.env.PREFIX}rsong [Genre]`,
		'rsong2': `Random music from another API.`,
		'ranime': 'Random anime character.'
	};


	/**
	 * @param {Client} client
	 * @param {Message} msg
	 */

	async operate(client, msg) {

		let media;
		let quote = msg;
		if (msg.hasQuotedMsg) {
			quote = await msg.getQuotedMessage();
		}
		try {
			if (msg.body.includes(`${process.env.PREFIX}rmeme`)) {
				let count = 1
				const regexmatch = msg.body.slice(1).match(/rmeme (\d+)/)
				if (regexmatch) {
					count = Math.min(parseInt(regexmatch[1]), 5)
				}
				while (count--) {
					let memeMedia = await MessageMedia.fromUrl('https://img.randme.me/', { unsafeMime: true });
					client.sendMessage(quote.from, memeMedia);
				}
			}

			if (msg.body.includes(`${process.env.PREFIX}rsong2`)) {
				
				let response = await got(`https://randofy.vercel.app/api/random`)
				let jsondata = JSON.parse(response.body);
				let trackname = jsondata['track_name'];
				let imageurl = jsondata['album_image']['url'];
				let spotifyurl = jsondata['spotify_url'];
				// let releasedate = jsondata['release_date'];
				let artist = jsondata['track_artist'];
				let image = await MessageMedia.fromUrl(imageurl, { unsafeMime: true });
				let message = `*${trackname}* by ${artist}\n${spotifyurl}`


				//Fetching the mp3-preview
				let media = await MessageMedia.fromUrl(jsondata['preview_url'], { unsafeMime: true, filename: trackname + '.mp3' });
				let sentmsg = await quote.reply(image, quote.from, { caption: message });
				await client.sendMessage(quote.from, media, { sendAudioAsVoice: true });
				console.log("Sent the random track and preview");
			}

			else if (msg.body.includes(`${process.env.PREFIX}rsong`)) {

				let genre = "pop";

				const regxmatch = msg.body.slice(1).match(/rsong (.+)/);
				if (regxmatch) {
					genre = regxmatch[1].replace(' ', '_');
				}

				let response = await got(`https://europe-west1-randommusicgenerator-34646.cloudfunctions.net/app/getRandomTrack?genre=${genre}`)
				let jsondata = JSON.parse(response.body);
				let trackname = jsondata['name'];
				let imageurl = jsondata['tracks'][0]['album']['images'][0]['url'];
				let spotifyurl = jsondata['link'];
				// let releasedate = jsondata['release_date'];
				let artist = jsondata['artists'][0]['name'];
				let image = await MessageMedia.fromUrl(imageurl, { unsafeMime: true });
				let message = `*${trackname}* by ${artist}\n${spotifyurl}`


				//Fetching the mp3-preview
				response = await got(`https://open.spotify.com/embed/track/${jsondata['id']}`);
				let mp3url = response.body.match(/(https:\/\/p\.scdn\.co\/mp3-preview\/[\d\w]+)/)[1];
				console.log(mp3url);
				let media = await MessageMedia.fromUrl(mp3url, { unsafeMime: true, filename: trackname + '.mp3' });
				let sentmsg = await quote.reply(image, quote.from, { caption: message });
				await client.sendMessage(quote.from, media, { sendAudioAsVoice: true });
				console.log("Sent the random track and preview");
			}

			else if (msg.body.includes(`${process.env.PREFIX}ranime`)) {
				let r1 = Math.floor(Math.random() * 2817 + 1);
				let response = await got(`https://api.jikan.moe/v4/top/characters?page=${r1}`)
				// console.log(response.body);
				let jsondata = JSON.parse(response.body);
				let r2 = Math.floor(Math.random() * jsondata['data'].length);
				let character = jsondata['data'][r2];
				// console.log(r1, r2);
				let character_name_en = character['name'];
				let character_name_jp = character['name_kanji'];
				let character_image = character['images']['jpg']['image_url'];
				let character_about = character['about'];
				let character_link = character['url'];

				let caption = `*${character_name_en}* (${character_name_jp})\n\n${character_about}\n\n${character_link}`
				media = await MessageMedia.fromUrl(character_image, { unsafeMime: true });
				await quote.reply(media, quote.from, { caption: caption });
			}
		} catch (err) {
			console.error("api error:", err);
			msg.reply(
				"Sorry couldn't fulfill your request. Please try again.",
				msg.from
			);
		}
	}
}

module.exports = Module
