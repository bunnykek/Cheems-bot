const { Message, MessageMedia } = require('whatsapp-web.js');
const animals = require('random-animals-api'); 
const got = require('got');

class Module {
	/** @type {string[]} */
	command = [
		'!cat',
		'!dog',
		'!bunny',
		'!duck',
		'!fox',
		'!lizard',
		'!shiba'
	];

	/** @type {string[]} */
	description = [
		'Get random pic of a kitty cat',
		'See a random dog with this command',
		'See pic of a random bunny',
		'Get a quacking duck with this command',
		'Get random pic of a fox',
		'See pic of a lizard',
		'Get a shiba pic on the chat'
	];

	/**
	 * @pram {Client} client
	 * @pram {Message} msg
	 */

	async operate (client, msg) {
		let animal = null;
		for (let tag of this.command) {
			if (msg.body.includes(tag)) {
				animal = tag.slice(1);
				break;
			}
		}

		try {
			// random-animals-api for cat isn't working now
			if (animal === 'cat') {
				const media = await MessageMedia.fromUrl('https://cataas.com/cat', { unsafeMime: true })
					.catch( (err) => { throw err; } );
				msg.reply(
					media,
					msg.from
				);
			} else {
				let req = await animals[animal]()
					.then( async (url) => { 
						const media = await MessageMedia.fromUrl(url).catch( (err) => { throw err; } );
						msg.reply(
							media,
							msg.from
						);
					})
					.catch( (err) => {throw err});
			}
		} catch (err) {
			console.error(`!${animal} error: `, err);
			msg.reply(
				'Sorry couldn\'t fulfill your request right now :(',
				msg.from
			);
		}
	}

}

module.exports = Module
