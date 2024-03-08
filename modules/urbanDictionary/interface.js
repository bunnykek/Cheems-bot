const { Message, MessageMedia } = require('whatsapp-web.js');
const got = require('got');
require('dotenv').config()

class Module {

    /** @type {string} */
    name = 'UrbanDictionary'

    /** @type {string} */
    description = 'Get the Urban Dictionary definition.'

    /** @type {JSON} */
    commands = {
        'ud': `${process.env.PREFIX}ud word`
    };


    /**
     * @param {Client} client
     * @param {Message} msg
     */

    async operate(client, msg) {
        if (msg.body.includes('!ud')) {
            var url = 'https://api.urbandictionary.com/v0/random';
            const regxmatch = msg.body.slice(1).match(/ud (.+)/);
            if (regxmatch) {
                let word = regxmatch[1].split(' ')[0];
                url = `https://api.urbandictionary.com/v0/define?term=${word}`;
            }
            let response = await got(url);
            let jsondata = JSON.parse(response.body);
            let message = `*${jsondata['list'][0]['word']}*\n${jsondata['list'][0]['definition']}\n\n*e.g.*\n${jsondata['list'][0]['example']}`
            await msg.reply(message, msg.from);
        }
    }
}

module.exports = Module
