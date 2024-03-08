const { Message, MessageMedia } = require('whatsapp-web.js');
const animals = require('random-animals-api'); 
const got = require('got');

class Module {
	/** @type {string} */
	name = 'Animals'

	/** @type {string} */
	description = 'For fetching random animal images.'

	/** @type {JSON} */
	commands = {
		'cat': 'Get a cat.',
		'dog': 'Get a dog.',
	};

	/**
	 * @pram {Client} client
	 * @pram {Message} msg
	 */

	async operate (client, msg) {
		let animal = null;
		for (let tag of Object.keys(this.commands)) {
			if (msg.body.includes(tag)) {
				animal = tag;
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
