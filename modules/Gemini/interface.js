const { Message, MessageMedia } = require('whatsapp-web.js');
const got = require('got');
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: "I want to chat today, please answer in as minimum word as you can, do not include unnecessary things, give clear and precise answer and if you user asks you to generate more than 500 words just reply with sorry and told your token limit to him",
        },
        {
            role: "model",
            parts: "Great to meet you. What would you like to know?",
        }
    ],
    generationConfig: {
        maxOutputTokens: 500,
    }
});


class Module {

    /** @type {string} */
	name = 'Gemini'

	/** @type {string} */
	description = `Chat with Gemini-AI.`

	/** @type {JSON} */
	commands = {
		'gemini': `Connect with Gemini AI.\n${process.env.PREFIX}gemini query.`,
	};

    /**
     * @param {Client} client
     * @param {Message} msg
     */

    async operate(client, msg) {

        if (msg.body.includes(`${process.env.PREFIX}gemini`)) {
            var query;

            //regular expression match with gemini keyword
            const regxmatch = msg.body.slice(1).match(/gemini (.+)/);
            if (regxmatch) {
                query = regxmatch[1];
            }
            else {
                console.log("No regex match!");
                query = "Hi";
            }
            const prompt = query;

            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const text = response.text();
            await msg.reply(text, msg.from);
        }
        // else if (msg.body.includes("...")) {
        //     const history = chat.getHistory();
        //     console.log(history);
        //     var query;

        //     //regular expression match with gemini keyword
        //     const regxmatch = msg.body.match(/\.\.\. (.+)/);
        //     if (regxmatch) {
        //         query = regxmatch[1];
        //         // console.log(query);
        //     }
        //     else {
        //         console.log("No regex match!");
        //     }
        //     const prompt = query;

        //     const result = await chat.sendMessage(prompt);
        //     const response = result.response;
        //     const text = response.text();
        //     await msg.reply(text, msg.from);
        //     // console.log(text);
        // }
    }
}

module.exports = Module
