const { Message, MessageMedia } = require('whatsapp-web.js');
const got = require('got');

class Module {
	/** @type {string[]} */
	command = ['!rmeme', '!rsong', '!ranime'];

	/** @type {string[]} */
	description = ['Random meme.', 'Random music.', 'Random anime character.']

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 */

	async operate(client, msg) {
		
		let media;
		let quote = msg;
		if(msg.hasQuotedMsg){
			quote = await msg.getQuotedMessage();
		}
		try {
			if(msg.body.includes('!rmeme')){
				media = await MessageMedia.fromUrl('https://img.randme.me/', {unsafeMime: true});
				await quote.reply(media, quote.from);
			}

			if(msg.body.includes('!rsong')){
				let response = await got('https://europe-west1-randommusicgenerator-34646.cloudfunctions.net/app/getRandomTrack?genre=pop&market=random&decade=2010s&tag_new=false&exclude_singles=false')
				let jsondata = JSON.parse(response.body);
				let trackname = jsondata['name'];
				let imageurl = jsondata['tracks'][0]['album']['images'][0]['url'];
				let spotifyurl = jsondata['link'];
				// let releasedate = jsondata['release_date'];
				let artist = jsondata['artists'][0]['name'];
				media = await MessageMedia.fromUrl(imageurl, {unsafeMime: true});
				let message = `*${trackname}* by ${artist}\n${spotifyurl}`
				await quote.reply(media, quote.from, {caption: message});
			}

			if(msg.body.includes('!ranime')){
				let r1 = Math.floor(Math.random()*2817 + 1);
				let response = await got(`https://api.jikan.moe/v4/top/characters?page=${r1}`)
				// console.log(response.body);
				let jsondata = JSON.parse(response.body);
				let r2 = Math.floor(Math.random()* jsondata['data'].length);
				let character = jsondata['data'][r2];
				// console.log(r1, r2);
				let character_name_en = character['name'];
				let character_name_jp = character['name_kanji'];
				let character_image = character['images']['jpg']['image_url'];
				let character_about = character['about'];
				let character_link = character['url'];
				
				let caption = `*${character_name_en}* (${character_name_jp})\n\n${character_about}\n\n${character_link}`
				media = await MessageMedia.fromUrl(character_image, {unsafeMime: true});
				await quote.reply(media, quote.from, {caption: caption});
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
