const { MessageMedia, Message, Client } = require('whatsapp-web.js');
const got = require('got')
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)



const fs = require('fs');
require('dotenv').config()

const TG_BOT_API = process.env.TG_BOT_API || null;

if (!fs.existsSync('./modules/sticker/tmp/')) {
    // If it doesn't exist, create it
    fs.mkdirSync('./modules/sticker/tmp/');
    console.log(`Folder './modules/sticker/tmp/' created.`);
}

class Module {
    /** @type {string[]} */
    command = ['!sticker', '!steal', '!image', '!square'];

    /** @type {string[]} */
    description = [
        'Reply or send media with _!sticker_ to get it back as a sticker also supports Telegram sticker packs.',
        'Reply to a sticker to steal it.',
        'Converts the sticker to image.',
        'Get back the media as 1:1 cropped sticker.'
    ];

    /** 
     * @param {string} msg_string
     * @param {Message} msg 
    */
   
    // videocropsync(filepath, squarefilepath){
    //     return new Promise((resolve,reject)=>{
    //         ffmpeg(filepath)
    //         .duration(5)
    //         .videoFilter(`crop=w='min(iw,ih)':h='min(iw,ih)'`)
    //         .outputOptions('-movflags frag_keyframe+empty_moov')
    //         .save(squarefilepath)
    //         .on('end', ()=>{
    //             console.log(`Video rendered`)
    //             return resolve()
    //         })
    //         .on('err',(err)=>{
    //             return reject(err)
    //         })
    //     })
    // }

    async fun(msg_string, msg) {
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

        if (msg_string.includes("!sticker") || msg_string.includes('!steal')) {
            await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
        }


        if (msg_string.includes("!square")) {
            let randno = (Math.random() * 100 + 100).toString();
            let filextension = media.mimetype.split('/')[1];
            let filepath = "./modules/sticker/tmp/" + randno + '.' + filextension;
            let squarefilepath = "./modules/sticker/tmp/" + 'square_' + randno + '.' + filextension;
            console.log("filesize:", media.filesize);
            
            fs.writeFile(filepath, media.data, "base64",
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            
            try{
                await exec(`ffmpeg -to 00:00:05 -i ${filepath} -vf "crop=w='min(iw,ih)':h='min(iw,ih)'" -movflags "frag_keyframe+empty_moov" -y ${squarefilepath}`);
                media = MessageMedia.fromFilePath(squarefilepath);
                await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
                fs.rmSync(filepath)
                fs.rmSync(squarefilepath)
            }
            catch(err){
                console.log(err);
                if (fs.existsSync(filepath)) {
                    fs.rmSync(filepath)
                }
                if (fs.existsSync(squarefilepath)) {
                    fs.rmSync(squarefilepath)
                }
                await msg.reply("Corrupted file.", msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
            }
            // await (function (){
            //     return new Promise((resolve,reject)=>{
            //         ffmpeg({
            //             source: stream.Readable.from([new Buffer.from(media.data, 'base64')], { objectMode: false })
            //         })
            //         .duration(5)
            //         .videoFilter(`crop=w='min(iw,ih)':h='min(iw,ih)'`)
            //         .outputOptions(['-movflags frag_keyframe+empty_moov'])
            //         .save(squarefilepath)
            //         .on('end', ()=>{
            //             console.log(`Video rendered`)
            //             return resolve()
            //         })
            //         .on('err',(err)=>{
            //             return reject(err)
            //         })
            //     })
            // })()

    

            // await new Promise(resolve => setTimeout(resolve, 2000));

            // if (fs.existsSync(filepath)) {
            //     await this.videocropsync(filepath, squarefilepath);
            //     media = MessageMedia.fromFilePath(squarefilepath);
            //     await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
            //     fs.rmSync(filepath)
            //     fs.rmSync(squarefilepath)
            // }

        }

        if (msg_string.includes("!image")) {
            await msg.reply(media, msg.from)
        }
    }


    /** 
     * @param {Client} client
     * @param {Message} msg 
    */
    async operate(client, msg) {

        //if the message has url
        var urlRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;
        var matches = msg.body.match(urlRegex);
        if (matches) {
            let url = matches[0];
            if (url.includes('https://t.me/addstickers') || url.includes('https://telegram.me/addstickers')) {

                //check if bot_token is available
                if (!TG_BOT_API) {
                    msg.reply("TG_BOT_API ENV variable is not set.", msg.from)
                    return;
                }

                let urlsplit = url.split("/");
                let packname = urlsplit[urlsplit.length - 1];
                console.log("packname:", packname);
                let response = await got(`https://api.telegram.org/bot${TG_BOT_API}/getStickerSet?name=${packname}`);
                let packjson = JSON.parse(response.body);
                if (packjson['result']['is_animated']) {
                    msg.reply("Animated sticker packs are not supported. Use only static or video sticker-packs for telegram.", msg.from)
                    return;
                }
                for (const sticker of packjson['result']['stickers']) {
                    let stickeres = await got(`https://api.telegram.org/bot${TG_BOT_API}/getFile?file_id=${sticker['file_id']}`);
                    let stickerjson = JSON.parse(stickeres.body);
                    let media = await MessageMedia.fromUrl(`https://api.telegram.org/file/bot${TG_BOT_API}/${stickerjson['result']['file_path']}`, {unsafeMime: true});
                    client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerName: 'bonk!', stickerAuthor: 'cheems' });
                    await new Promise(resolve => setTimeout(resolve, 1234));
                }
            }
            else {
                let media = await MessageMedia.fromUrl(url);
                await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: 'bonk!', stickerAuthor: 'cheems' })
            }
        }

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
