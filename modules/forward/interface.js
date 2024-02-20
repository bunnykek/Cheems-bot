const { Message, MessageMedia } = require('whatsapp-web.js');

class Module {
	/** @type {string[]} */
	command = ['!fwd', '!fwds'];

	/** @type {string[]} */
	description = ['Reply the quoted message as forwarded.', 'Show the forward score.']

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 */

	async operate(client, msg) {
		if(msg.body == '!fwd' && msg.hasQuotedMsg){
			let message = await msg.getQuotedMessage()
			message.forward(msg.from)
		}

		if(msg.body == '!fwds' && msg.hasQuotedMsg){
			let message = await msg.getQuotedMessage()
			message.reply(`_${message.forwardingScore} forwards._`)
		}
	}
}

module.exports = Module