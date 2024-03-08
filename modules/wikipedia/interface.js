const { Message, MessageMedia } = require('whatsapp-web.js');
const got = require('got');
require('dotenv').config()

class Module {

    /** @type {string} */
	name = 'Wikipedia'

	/** @type {string} */
	description = 'Get Wikipedia articles.'

	/** @type {JSON} */
	commands = {
		'wiki': `Get the Wikipedia summary.\n${process.env.PREFIX}wiki [query]`,
		'wikipdf': `Get the Wikipedia article in PDF format.\n${process.env.PREFIX}wikipdf [query]`,
	};


    /**
     * @param {Client} client
     * @param {Message} msg
     */

    async operate(client, msg) {
        const fetchRandomTitle = async function(){
            let response = await got('https://en.wikipedia.org/api/rest_v1/page/random/title');
            let jsondata = JSON.parse(response.body);
            return jsondata['items'][0]['title'];
        }

        if(msg.body.includes(`${process.env.PREFIX}wikipdf`)){
            var query;
            const regxmatch = msg.body.slice(1).match(/wikipdf (.+)/);
            if (regxmatch) {
                query = regxmatch[1];
            }
            else{
                console.log("No regex match!");
                query = await fetchRandomTitle();
            }

            console.log("pdf query:", query);
            let media = await MessageMedia.fromUrl(`https://en.wikipedia.org/api/rest_v1/page/pdf/${query}/a4/desktop`, {unsafeMime: true, filename: query+'.pdf'})
            await msg.reply(media, msg.from, {sendMediaAsDocument: true});
        }

        else if (msg.body.includes(`${process.env.PREFIX}wiki`)) {
            var query;
            const regxmatch = msg.body.match(/!wiki (.+)/);
            if (regxmatch) {
                query = regxmatch[1];
            }
            else{
                console.log("No regex match!");
                query = await fetchRandomTitle();
            }

            console.log("query:", query);
            let response = await got(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
            let jsondata = JSON.parse(response.body);
            let title, thumbnailUrl, description, extract, articleUrl;
            
            title = jsondata['title'];
            thumbnailUrl = jsondata['originalimage']['source'];
            description = jsondata['description'];
            extract = jsondata['extract']
            articleUrl = jsondata['content_urls']['mobile']['page'];

            let media = await MessageMedia.fromUrl(thumbnailUrl);
            
            let message = `*${title}*\n_${description}_\n\n${extract}\n\n${articleUrl}`
            await msg.reply(media, msg.from, {caption: message});
        }
    }
}

module.exports = Module
