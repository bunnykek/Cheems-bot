const {MessageMedia, Message, Client} = require('whatsapp-web.js');
const {execSync} = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

const fs = require('fs');

class Module {
    /** @type {string[]} */
    command = ['!sticker', '!steal', '!image', '!square'];
    
    /** @type {string[]} */
    description = [
                    'Reply or send media with _!sticker_ to get it back as a sticker', 
                    'Reply to a sticker to steal it.',
                    'Converts the sticker to image.',
                    'Get back the media as 1:1 cropped sticker.'
                ];

    /** 
     * @param {string} msg_string
     * @param {Message} msg 
     */
                
    async fun(msg_string, msg){
        //regex to extract the stickername and stickerauthor from message text
        let stkName = 'bonk!';
        let stkAuth = 'cheems';
        const regxmatch = msg_string.match(/ (.+)\-(.+)/);
        if (regxmatch) {
            stkName = regxmatch[1];
            stkAuth = regxmatch[2];
        }
        // console.log(regxmatch);
        console.log(stkName, stkAuth);


        let media = await msg.downloadMedia();
        console.log(media.mimetype);
        
        if(msg_string.includes("!sticker") || msg_string.includes('!steal')){
            await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
        }

     
        if(msg_string.includes("!square")){
            let randno = (Math.random()*100+100).toString();
            let filextension = media.mimetype.split('/')[1];
            let filepath = "./modules/sticker/" + randno+'.'+filextension;
            let squarefilepath = "./modules/sticker/" + 'square_'+randno+'.'+filextension;
            fs.writeFile(filepath, media.data, "base64",
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
            );
     
            await new Promise(resolve => setTimeout(resolve, 2000));
     
            if(fs.existsSync(filepath)){
                // execSync(`ffmpeg -i ${filepath} -vf "crop=w='min(iw,ih)':h='min(iw,ih)'" ${squarefilepath}`)
                ffmpeg()
                .input(filepath)
                .videoFilter('crop=w=min(iw\\,ih):h=min(iw\\,ih)')
                .outputOptions('-movflags frag_keyframe+empty_moov')
                .output(squarefilepath)
                .run();
            }
     
            await new Promise(resolve => setTimeout(resolve, 2000));
     
            media = MessageMedia.fromFilePath(squarefilepath);
            await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
            fs.rmSync(filepath)
            fs.rmSync(squarefilepath)
        }
        
        if(msg_string.includes("!image")){
            await msg.reply(media, msg.from)
        }
    }
    
    /** 
     * @param {Client} client
     * @param {Message} msg 
    */
    async operate(client, msg) {

        
        //if the message has media
        if (msg.hasMedia) {
            await this.fun(msg.body, msg);
        }


        // if the command is replied to media
        if (msg.hasQuotedMsg) {
            let quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) {
                await this.fun(msg.body, quoted)
            }
        }
    }
}

module.exports = Module
