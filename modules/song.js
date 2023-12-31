const { Message, MessageMedia } = require('whatsapp-web.js');
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

class Song {
	command = ['!song'];
	description = ['Pass the song name along with the command to download the audio of the song.'];

	async operate(msg, client) {
// 		let ind = msg.body.indexOf(command[0]);
// 		if (ind + command[0].length + 1 >= msg.body.length)
// 			return;
// 		let songName = msg.body.substring(ind+command[0].length+1);

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
					const video = await yts({ videoId: songId });
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
				var stream = ytdl(Id, {
					quality: "highestaudio",
				});

				if (!fs.existsSync('./tmp')){
					fs.mkdirSync('./tmp');
				}

				ffmpeg(stream)
					.audioBitrate(320)
					.toFormat("ipod")
					.saveToFile(`tmp/${msg.id.id}.mp3`)
					.on("end", async () => {
						let uploading_msg = await client.sendMessage(
							msg.from,
							`Uploading your song (for request ${songName})...`,
						);

						const media = MessageMedia.fromFilePath(`tmp/${msg.id.id}.mp3`);
						await msg.reply(
							media,
							msg.from
						);

						fs.unlink(`tmp/${msg.id.id}.mp3`, (err) => {
							if (err) throw err;
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
