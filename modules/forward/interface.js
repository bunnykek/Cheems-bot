const { Message, MessageMedia } = require('whatsapp-web.js');

class Module {
	/** @type {string} */
	name = 'Forward'

	/** @type {string} */
	description = 'Messaging forwarding features.'

	/** @type {JSON} */
	commands = {
		'fwd': 'Reply the quoted message as forwarded.',
		'fwds': 'Show the forward score.',
	};

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 */

	async operate(client, msg) {
		if(msg.body == `${process.env.PREFIX}fwd` && msg.hasQuotedMsg){
			let message = await msg.getQuotedMessage()
			message.forward(msg.from)
		}

		if(msg.body == `${process.env.PREFIX}fwds` && msg.hasQuotedMsg){
			let message = await msg.getQuotedMessage()
			message.reply(`_${message.forwardingScore} forwards._`)
		}
	}
}

module.exports = Module