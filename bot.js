const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const logo ='  /$$$$$$  /$$                                                          /$$                   /$$    \n /$$__  $$| $$                                                         | $$                  | $$    \n| $$  \\__/| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$$       | $$$$$$$   /$$$$$$  /$$$$$$  \n| $$      | $$__  $$ /$$__  $$ /$$__  $$| $$_  $$_  $$ /$$_____//$$$$$$| $$__  $$ /$$__  $$|_  $$_/  \n| $$      | $$  \\ $$| $$$$$$$$| $$$$$$$$| $$ \\ $$ \\ $$|  $$$$$$|______/| $$  \\ $$| $$  \\ $$  | $$    \n| $$    $$| $$  | $$| $$_____/| $$_____/| $$ | $$ | $$ \\____  $$       | $$  | $$| $$  | $$  | $$ /$$\n|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ | $$ | $$ /$$$$$$$/       | $$$$$$$/|  $$$$$$/  |  $$$$/\n \\______/ |__/  |__/ \\_______/ \\_______/|__/ |__/ |__/|_______/        |_______/  \\______/    \\___/  \n                                             A modular WhatsApp bot\n                                                 --by @bunnykek'
console.log(logo);
console.log("Loading the modules...");

// importing modules from a directory
const directoryPath = './modules';

const modules = fs.readdirSync(directoryPath)
const moduleObjects = [];

for (const module of modules) {
  console.log(module);
  moduleClass = require(`${directoryPath}/${module}/interface.js`);
  moduleObjects.push(new moduleClass());  // Assuming no constructor arguments
}


let state = {
	'count': { 'next_num': null, 'warned': false }
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('disconnected', () => {
  console.log('Client is disconnected!');
});

client.on('authenticated', () => {
  console.log('Client is authenticated!');
});

client.on('auth_failure', () => {
  console.log('Client is auth_failure!');
});

client.on('message', async msg => {
  if (msg.body == '!ping') {
    msg.reply('pong!');
  }

  if (msg.body == '!alive') {
    msg.reply('beep boop!');
  }

  if (msg.body == '!help') {
    let helpstring = `*Cheems bot*\n\n`
    moduleObjects.forEach(obj => {
      for (i = 0; i < obj.command.length; i++) {
        helpstring += `*${obj.command[i]}:* ${obj.description[i]}\n\n`
      }
    })
    msg.reply(helpstring);
  }

  for (const obj of moduleObjects) {
    for (const cmd of obj.command) {
      if (msg.body.includes(cmd)) {
        obj.operate(client, msg, state)
          .catch(error => {
            console.log(error);
            msg.reply("_Could not process your request :/_")
          })
        break;
      }
    }
  }
});

client.initialize();
