const { Message, MessageMedia, Client } = require('whatsapp-web.js');

class Module {

    /** @type {string} */
	name = 'YearProgress'

	/** @type {string} */
	description = 'Shows the current year progress.'

	/** @type {JSON} */
	commands = {
		'yp': 'Shows the current year progress.',
	};
    

    /**
     * @param {Client} client
     * @param {Message} msg
     */

    async operate(client, msg) {
        var today = new Date();
        let daycount = Math.ceil((today - new Date(today.getFullYear(),0,1)) / 86400000);
        var n1 = Math.ceil(daycount*20/365)
        var mesage = "*Year progress:*\n"+"▓".repeat(n1)+"░".repeat(20-n1)+` ${Math.ceil(daycount*100/365)}%`
        await client.sendMessage(msg.from, mesage);
    }
}

module.exports = Module
