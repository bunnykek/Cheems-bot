const { Message } = require('whatsapp-web.js');

class Sticker {
    /** @type {string[]} */
    command = ['!sticker', '!steal'];

    /** @param {Message} msg */
    async operate(msg) {

        //regex to extract the stickername and stickerauthor from message text
        let stkName = 'bonk!';
        let stkAuth = 'cheems';
        const regxmatch = msg.body.match(/ (.+)\-(.+)/);
        if (regxmatch) {
            stkName = regxmatch[1];
            stkAuth = regxmatch[2];
        }
        // console.log(regxmatch);
        console.log(stkName, stkAuth);

        //if the body has media then return it as sticker
        if (msg.hasMedia) {
            let media = await msg.downloadMedia();
            msg.reply(media, msg.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth })
        }

        //if the message to which !sticker is replied contains media or !steal is used
        if (msg.hasQuotedMsg) {
            let quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) {
                let media = await quoted.downloadMedia();
                msg.reply(media, quoted.from, { sendMediaAsSticker: true, stickerName: stkName, stickerAuthor: stkAuth });
            }
        }
    }
}

module.exports = Sticker