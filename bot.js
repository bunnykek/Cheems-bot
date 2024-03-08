const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const logo = '  /$$$$$$  /$$                                                          /$$                   /$$    \n /$$__  $$| $$                                                         | $$                  | $$    \n| $$  \\__/| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$$       | $$$$$$$   /$$$$$$  /$$$$$$  \n| $$      | $$__  $$ /$$__  $$ /$$__  $$| $$_  $$_  $$ /$$_____//$$$$$$| $$__  $$ /$$__  $$|_  $$_/  \n| $$      | $$  \\ $$| $$$$$$$$| $$$$$$$$| $$ \\ $$ \\ $$|  $$$$$$|______/| $$  \\ $$| $$  \\ $$  | $$    \n| $$    $$| $$  | $$| $$_____/| $$_____/| $$ | $$ | $$ \\____  $$       | $$  | $$| $$  | $$  | $$ /$$\n|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ | $$ | $$ /$$$$$$$/       | $$$$$$$/|  $$$$$$/  |  $$$$/\n \\______/ |__/  |__/ \\_______/ \\_______/|__/ |__/ |__/|_______/        |_______/  \\______/    \\___/  \n                                             A modular WhatsApp bot\n                                                 --by @bunnykek'
console.log(logo);
console.log("Loading the modules...");

// importing modules from a directory
const directoryPath = './modules';

const modules = fs.readdirSync(directoryPath)
const moduleObjects = {};

for (const module of modules) {
  if (module[0] == '.') continue;
  moduleClass = require(`${directoryPath}/${module}/interface.js`);
  moduleObjects[module] = new moduleClass();
  console.log(moduleObjects[module].name);
}


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
  if (msg.body == `${process.env.PREFIX}ping`) {
    msg.reply('pong!');
  }

  if (msg.body == `${process.env.PREFIX}alive`) {
    msg.reply('beep-boop!');
  }

  if (msg.body.includes(`${process.env.PREFIX}help`)) {
    if (msg.body.toLowerCase().includes('-v')) {
      let helpstring = `*Cheems-bot*\n\nAvailable commands:\n`;
      for (const [_, module] of Object.entries(moduleObjects)) {
        for (const [cmd, desc] of Object.entries(module.commands)) {
          helpstring += `*${process.env.PREFIX}${cmd}*\n> ${desc.replace('\n', '\n> ')}\n\n`
        }
      }
      msg.reply(helpstring.trim());
      return;
    }

    if (msg.body.split(' ').length == 1) {
      let helpstring = `*Cheems-bot*\n\nModule description:\n> ${process.env.PREFIX}help module1 module2...\n\n*Available modules:*\n`;
      for (const [_, module] of Object.entries(moduleObjects)) {
        let cmdList = []
        for (const [cmd, _] of Object.entries(module.commands)) cmdList.push(`${process.env.PREFIX}${cmd}`)
        helpstring += `${module.name}\n> ${module.description}\n> ${cmdList.join(', ')}\n\n`
      }
      helpstring += `To list all the commands:\n> ${process.env.PREFIX}help -v`
      msg.reply(helpstring.trim());
      return;
    }

    else {
      let helpstring = '*Module commands:*\n\n'
      let added = 0;
      for (const arg of msg.body.toLowerCase().split(' ')) {
        if (arg in moduleObjects) {
          added = 1;
          helpstring += `*${moduleObjects[arg].name}*\n> ${moduleObjects[arg].description}\n\n`;
          for (const [cmd, desc] of Object.entries(moduleObjects[arg].commands)) {
            helpstring += `${process.env.PREFIX}${cmd}\n> ${desc.replace('\n', '\n> ')}\n\n`
          }
        }
      }
      if(!added) msg.reply("_No module(s) found._")
      else msg.reply(helpstring.trim())
    }
    return;
  }

  for (const [_, module] of Object.entries(moduleObjects)) {
    for (const [cmd, _] of Object.entries(module.commands)) {
      if (msg.body.includes(`${process.env.PREFIX}${cmd}`)) {
        module.operate(client, msg)
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
