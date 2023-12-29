const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');


// importing modules from a directory
const directoryPath = './modules';  

const classFiles = fs.readdirSync(directoryPath)
  .filter(filename => filename.endsWith('.js'));

const objects = [];

for (const filename of classFiles) {
  let moduleName = filename.replace('.js', '');  // Remove the extension
  moduleName = moduleName[0].toUpperCase()+moduleName.substring(1);
  console.log(moduleName);
  moduleName = require(`${directoryPath}/${filename}`);
  objects.push(new moduleName());  // Assuming no constructor arguments
}


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
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

  objects.forEach(obj => {
    obj.command.forEach(cmd => {
      if(msg.body.includes(cmd)){
        obj.operate(msg);
      }
    })
  })
});

client.initialize();
