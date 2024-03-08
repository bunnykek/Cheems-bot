const { MessageMedia, Message, Client } = require('whatsapp-web.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const fs = require("fs");
require('dotenv').config()


if (!fs.existsSync('./modules/ytdl/tmp/')) {
    // If it doesn't exist, create it
    fs.mkdirSync('./modules/ytdl/tmp/');
    console.log(`Folder './modules/ytdl/tmp/' created.`);
}

class Module {

    /** @type {string} */
	name = 'YTDL'

	/** @type {string} */
	description = 'Downloads video from various services.'

	/** @type {JSON} */
	commands = {
		'ytdl': `${process.env.PREFIX}ytdl URL`,
	};


    /** 
     * @param {Client} client
     * @param {Message} msg 
    */
    async operate(client, msg) {

        //if the message has url
        if(msg.body.includes(`${process.env.PREFIX}ytdl`)){
            await msg.reply("Downloading video...");
            var urlRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;
            var matches = msg.body.match(urlRegex);
            if (matches) {
                let url = matches[0];
                var file_path = `./modules/ytdl/tmp/%(title)s.mp4`;
                if(fs.existsSync('.modules/ytdl/cookies.txt')){
                    var output = await exec(`./modules/ytdl/yt-dlp -f "best[ext=mp4]" "${url}" --cookies "modules/ytdl/cookies.txt" -o "${file_path}"`);
                }
                else{
                    var output = await exec(`./modules/ytdl/yt-dlp -f "best[ext=mp4]" "${url}" -o "${file_path}"`);
                }
                const regexmatch = output.stdout.match(/(.\/.+\.mp4)/g);
                if(regexmatch){
                    file_path = regexmatch[regexmatch.length-1];
                }
                else{
                    throw ("Couldn't parse filename from terminal\n", output);
                }
                console.log(file_path);
                // console.log(output);
                let media =  MessageMedia.fromFilePath(file_path);
                msg.reply(media, msg.from, {sendMediaAsDocument: true});
                if (fs.existsSync(file_path)) fs.rmSync(file_path)
            }
            else{
                throw('Invalid url')
            }
        }
    }
}

module.exports = Module
