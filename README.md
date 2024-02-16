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
- Rename `.envexample` file to `.env` and fill the details.
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
- [x] Sticker (!sticker, !steal, !image, !square)
- [ ] Group management (!warn, !ban, !kick, etc)
- [x] AI Chatbot (!gemini query)
- [x] Music (!song query)
- [x] Year progress 
- [x] Animal module (!cat, !dog, !bunny, etc)
- [x] Random (!rmeme, !ranime, !rsong)
- [x] Meme (!meme [subreddit])
- [x] youtube-dl (!ytdl url) 
- [x] Urban dictionary (!ud query)
- [x] Wikipedia (!wiki [query], !wikipdf [query])
- [x] Counting (!count expression)
