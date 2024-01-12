const { Message, MessageMedia } = require('whatsapp-web.js');
const fs = require("fs");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const ytdl = require("ytdl-core");
const yts = require("yt-search");

class Module {
	/** @type {string[]} */
	command = ['!song'];

	/** @type {string[]} */
	description = ['Pass the song name or youtube link of the song along with the command to download the audio of the song.'];

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 */

	async operate(client, msg) {
		var replied_msg = msg.reply("Processing your song request...", msg.from);
		
		var quoted = msg;
		if(msg.hasQuotedMsg){
			quoted = await msg.getQuotedMessage();
		}

		let songName;
		const regxmatch = msg.body.match(/!song (.+)/);
		if (regxmatch) {
			songName = regxmatch[1];
		} else {
			msg.reply(
				"Provide song's name or youtube link of song with command.",
				msg.from
			);
			return;
		}

		let args = songName.split(' ');

		try {
			let Id = " ";
			if (args[0].includes("youtu")) {
				Id = args[0];
				if (args[0].includes("watch?v=")) {
					Id = args[0].split("watch?v=")[1].split('?')[0];
				} else {
					Id = args[0].split("/")[3].split('?')[0];
				}

			} else {
				var song = await yts(`${songName} Song`);
				song = song.all;
				if (song.length < 1) {
					throw "Song not found";
				}
				Id = song[0].url;
			}
			// select best audio format
			let info = await ytdl.getInfo(Id);

			if (!fs.existsSync('./modules/song/tmp')) {
				fs.mkdirSync('./modules/song/tmp');
			}

			// (await replied_msg).edit("Downloading...")
			var file_path = `./modules/song/tmp/${info.videoDetails.title}.aac`;
			const outputStream = fs.createWriteStream(file_path);
			ytdl.downloadFromInfo(info, {quality:'140'}).pipe(outputStream);
			outputStream.on('finish', async () => {
				console.log(`Finished downloading: ${file_path}`);
				// await exec(`ffmpeg -i ${file_path} -y ${final_path}`);
				(await replied_msg).edit("Uploading...")
				let media = MessageMedia.fromFilePath(file_path)
				await quoted.reply(media, quoted.from, {sendMediaAsDocument: true})
				
				if (fs.existsSync(file_path)) fs.rmSync(file_path)
				// if (fs.existsSync(final_path)) fs.rmSync(final_path)
			});
		}
		catch (error) {
			console.log("Song module error:", error);
			await msg.reply("Unable to process your request.", msg.from);
		}
	}
}
module.exports = Module
