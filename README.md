# cheems-bot
A modular Whatsapp bot.

### Dev-environment setup:
- Install [Docker](https://docs.docker.com/engine/install/), [VS Code](https://code.visualstudio.com/download) and [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
- Start the Docker application (It has to be keep running in background).
- Open Windows/Linux/Mac `CMD/Terminal` and do
  ```
  git clone https://github.com/bunnykek/cheems-bot
  cd cheems-bot
  code .
  ```
  or manually open the `cheems-bot` project folder in vs code.
- Now in VS Code, hit `ctrl + shift + P` and search `Dev Containers: Rebuild and Reopen in Container`. 
It will take few minutes depending on your internet connection.
![image](https://github.com/bunnykek/cheems-bot/assets/67633271/57f6584b-926f-4ede-abe2-46f78d991553)
- Now the project will re-open in a proper pre-configured environment/container.
- To start the bot use the command `node bot.js` or `npm run test`

### Building modules guide:
- Use [sticker](https://github.com/bunnykek/cheems-bot/blob/main/modules/sticker.js) module for reference.
- Modules file must contain a single class.
- Class name should be Title case. (Ex: Sticker, Chatgpt)
- Module file should have same name as class but in lowecase (ex: sticker.js, chatgpt.js)
- Class must contain these three things.
  - command variable. `command = ['!sticker', '!steal']`
  - description variable. `description = ['!sticker desc.', '!steal desc']`
  - operate() function.
