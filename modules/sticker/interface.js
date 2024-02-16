const { MessageMedia, Message, Client } = require('whatsapp-web.js');
const got = require('got')
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

            try {
                await exec(`ffmpeg -to 00:00:05 -i ${filepath} -vf "crop=w='min(iw,ih)':h='min(iw,ih)'" -movflags "frag_keyframe+empty_moov" -y ${squarefilepath}`);
                media = MessageMedia.fromFilePath(squarefilepath);
                await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
                fs.rmSync(filepath)
                fs.rmSync(squarefilepath)
            }
            catch (err) {
                console.log(err);
                if (fs.existsSync(filepath)) {
                    fs.rmSync(filepath)
                }
                if (fs.existsSync(squarefilepath)) {
                    fs.rmSync(squarefilepath)
                }
                await msg.reply("Corrupted file.", msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
            }

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
        const urlRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;
        const tgRegex = /https:\/\/(t|telegram)\.me\/addstickers\/(\w+)( +(\d+))?/g
        var matches = msg.body.match(urlRegex);
        if (matches) {

            //TG sticker pack check
            let tgMatch = msg.body.matchAll(tgRegex)
            let matchList = [...tgMatch]
            if (matchList[0]) {
                let maxcount = 200
                if (matchList[0][4])
                    maxcount = parseInt(matchList[0][4])

                //check if bot_token is available
                if (!TG_BOT_API) {
                    msg.reply("TG_BOT_API ENV variable is not set.", msg.from)
                    return;
                }

                let packname = matchList[0][2];
                console.log("packname:", packname);
                let response = await got(`https://api.telegram.org/bot${TG_BOT_API}/getStickerSet?name=${packname}`);
                let packjson = JSON.parse(response.body);
                if (packjson['result']['is_animated']) {
                    msg.reply("Animated sticker packs are not supported. Use only static or video sticker-packs for telegram.", msg.from)
                    return;
                }
                for (var i = 0; i < Math.min(maxcount, packjson['result']['stickers'].length); i++) {
                    let sticker = packjson['result']['stickers'][i];
                    let stickeres = await got(`https://api.telegram.org/bot${TG_BOT_API}/getFile?file_id=${sticker['file_id']}`);
                    let stickerjson = JSON.parse(stickeres.body);
                    console.log(stickerjson['result']['file_path']);

                    if (stickerjson['result']['file_path'].includes('webp')) {
                        console.log("webp sticker");
                        let media = await MessageMedia.fromUrl(`https://api.telegram.org/file/bot${TG_BOT_API}/${stickerjson['result']['file_path']}`, { unsafeMime: true });
                        await client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerName: 'bonk!', stickerAuthor: 'cheems' });
                        await new Promise(resolve => setTimeout(resolve, 1234));
                    }

                    else {
                        console.log("Not .webp");
                        let filename = stickerjson['result']['file_path'].split('/')[1];
                        let filepath = "./modules/sticker/tmp/" + filename;
                        let newpath = "./modules/sticker/tmp/" + filename + '.webp';
                        const data = await got(`https://api.telegram.org/file/bot${TG_BOT_API}/${stickerjson['result']['file_path']}`, { responseType: 'buffer' });
                        // Save the response body to a file
                        fs.writeFileSync(filepath, data.body);
                        // await exec(`ffmpeg -i "${filepath}" -c libwebp -y "${newpath}"`);
                        await exec(`ffmpeg -c:v libvpx-vp9 -i "${filepath}" -y "${newpath}"`);
                        // await exec(`ffmpeg -i "${filepath}" -c libwebp -y "${newpath}"`);
                        let media = MessageMedia.fromFilePath(newpath);
                        console.log("Sticker size, ", media.mimetype, media.filesize);
                        try {
                            await client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerName: 'bonk!', stickerAuthor: 'cheems' });
                        }
                        catch (err) {
                            console.log("Failed sending the sticker,", err);
                        }

                        if (fs.existsSync(filepath)) {
                            fs.rmSync(filepath)
                        }
                        if (fs.existsSync(newpath)) {
                            fs.rmSync(newpath)
                        }
                    }
                }
            }
            //Bad practice therefore removed
            // else {
            //     let media = await MessageMedia.fromUrl(url);
            //     await msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: 'bonk!', stickerAuthor: 'cheems' })
            // }
        }

        //if the message has media
        if (msg.hasMedia) {
            this.fun(msg.body, msg)
                .catch(err => {
                    throw (err)
                });
        }


        // if the command is replied to media
        if (msg.hasQuotedMsg) {
            let quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) {
                this.fun(msg.body, quoted)
                    .catch(err => {
                        throw (err)
                    })
            }
        }
    }
}

module.exports = Module
