const { Message, MessageMedia } = require('whatsapp-web.js');
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

class Song {
	/** @type {string[]} */
	command = ['!song'];

	/** @type {string[]} */
	description = ['Pass the song name along with the command to download the audio of the song.'];

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

				if (!fs.existsSync('./tmp')){
					fs.mkdirSync('./tmp');
				}

				ffmpeg(stream)
					.audioBitrate(320)
					.withNoVideo()
					.toFormat("mp3")
					.saveToFile(`tmp/${msg.id.id}.mp3`)
					.on("end", async () => {
						console.log(`downloaded tmp/${msg.id.id}.mp3`);

						let uploading_msg = await client.sendMessage(
							msg.from,
							`Uploading your song (for request ${songName})...`,
						);

						const media = MessageMedia.fromFilePath(`tmp/${msg.id.id}.mp3`);
						await msg.reply(
							media,
							msg.from
						).catch((err) => {console.log("song reply err: ", err); throw err;});

						fs.unlink(`tmp/${msg.id.id}.mp3`, (err) => {
							if (err)  {
								console.log("fs.unlink err: ", err);
								throw err;
							}
							console.log(`tmp/${msg.id.id}.mp3 was deleted`);
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

module.exports = Song
