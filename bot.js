const qrcode = require('qrcode-terminal');
const { Client, LocalAuth} = require('whatsapp-web.js');
const fs = require('fs');


// importing modules from a directory
const directoryPath = './modules';  

const modules = fs.readdirSync(directoryPath)
const moduleObjects = [];

for (const module of modules) {
  console.log(module);
  moduleClass = require(`${directoryPath}/${module}/interface.js`);
  moduleObjects.push(new moduleClass());  // Assuming no constructor arguments
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

client.on('message', msg => {
  if (msg.body == '!ping') {
    msg.reply('pong');
  }

  if(msg.body == '!help'){
    let helpstring = `*Cheems bot*\n\n`
    moduleObjects.forEach(obj => {
      for(i=0; i<obj.command.length; i++){
        helpstring+=`*${obj.command[i]}:* ${obj.description[i]}\n\n`
      }
    })
    msg.reply(helpstring);
  }

  moduleObjects.forEach(obj => {
    obj.command.forEach(async cmd => {
      if(msg.body.includes(cmd)){
        try {
          obj.operate(client, msg);
        } catch (error) {
          console.log(error);
        }
      }
    })
  })
});

client.initialize();
