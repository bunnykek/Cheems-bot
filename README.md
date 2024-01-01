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
- Use [sticker](https://github.com/bunnykek/cheems-bot/blob/main/modules/sticker/interface.js) module for reference.
- Each module should contain a file named `"interface.js"`.
- `"interface.js"` must contain a class named `"Module"`.
- `"Module"` Class must contain these three things.
  - command variable. `command = ['!sticker', '!steal']`
  - description variable. `description = ['!sticker desc.', '!steal desc.']`
  - operate(client, message) function.

### Modules To-do list:
- [x] Sticker (!sticker, !steal, !image, !square) [already assigned]
- [ ] Group management (!warn, !ban, !kick, etc)
- [ ] Chat GPT (!gpt query)
- [x] Music (!song query) [already assigned]
- [ ] Year progress 
- [ ] Animal module (!cat, !dog, !otter, etc) [already assigned]
- [ ] Meme (Using reddit [meme api](https://github.com/D3vd/Meme_Api))
- [ ] youtube-dl (!ytdl url) [already assigned]
