const { Message, MessageMedia } = require('whatsapp-web.js');
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
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
				try {
					if (args[0].includes("watch?v=")) {
						var songId = args[0].split("watch?v=")[1];
					} else {
						var songId = args[0].split("/")[3];
					}
					const video = await yts({ videoId: songId })
						.catch((err) => {
							console.log("yt-search err: ", err);
							throw err;
						});
				} catch (err) {
					console.log("err: ", err);
					throw err;
				}
			} else {
				var song = await yts(songName);
				song = song.all;
				if (song.length < 1) {
					throw "Song not found";
				}
				Id = song[0].url;
			}
			try {
				// select best audio format
				let info = await ytdl.getInfo(Id);
				let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
				let bestFormat = null;
				for (let i = 0; i < info.formats.length; i += 1) {
					let format = info.formats[i];
					if (bestFormat == null || format.audioBitrate > bestFormat.audioBitrate) {
						bestFormat = format;
					}
				}

				let stream = ytdl.downloadFromInfo(info, { format: bestFormat });

				if (!fs.existsSync('./modules/tmp')){
					fs.mkdirSync('./modules/tmp');
				}

				ffmpeg(stream)
					.audioBitrate(320)
					.withNoVideo()
					.toFormat("mp3")
					.saveToFile(`./modules/tmp/${msg.id.id}.mp3`)
					.on("end", async () => {
						console.log(`downloaded ./modules/tmp/${msg.id.id}.mp3`);

						let uploading_msg = await client.sendMessage(
							msg.from,
							`Uploading your song (for request ${songName})...`,
						);

						const media = MessageMedia.fromFilePath(`./modules/tmp/${msg.id.id}.mp3`);
						await msg.reply(
							media,
							msg.from
						).catch((err) => {console.log("song reply err: ", err); throw err;});

						fs.unlink(`./modules/tmp/${msg.id.id}.mp3`, (err) => {
							if (err)  {
								console.log("fs.unlink err: ", err);
								throw err;
							}
							console.log(`./modules/tmp/${msg.id.id}.mp3 was deleted`);
						});
						uploading_msg.delete(true);
					});
			} catch (err) {
				throw err;
			}
		} catch (err) {
			msg.reply(
				"Sorry couldn't find your song :(",
				msg.from
			);
		}
	}
}

module.exports = Module
