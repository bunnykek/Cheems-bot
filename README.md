![Cheems-bot](https://github.com/bunnykek/Cheems-bot/blob/main/assets/logo.svg)
# Cheems-bot
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
- Use [forward](https://github.com/bunnykek/Cheems-bot/blob/main/modules/forward/interface.js) module for reference.
- Each module should contain a file named `"interface.js"`.
- `"interface.js"` must contain a class named `"Module"`.
- `"Module"` Class must contain these four methods.
  - Module name. `name = 'Forward'`
  - Module description. `description = 'Messaging forwarding features.'`
  - `operate(client, message)` function.
  - Module commands. 
```
commands = {
		'fwd': 'Reply the quoted message as forwarded.',
		'fwds': 'Show the forward score.',
	};
```

### Modules To-do list:
- [x] Animal module (!cat, !dog)
- [x] Forward (!fwd, !fwds)
- [x] AI Chatbot (!gemini query)
- [x] Meme (!meme [subreddit])
- [x] Random (!rmeme, !ranime, !rsong, !rsong2)
- [x] Song (!song query)
- [x] Sticker (!sticker, !steal, !image, !square)
- [x] Urban dictionary (!ud query)
- [x] Wikipedia (!wiki [query], !wikipdf [query])
- [x] Year progress (!yp)
- [x] youtube-dl (!ytdl url) 
- [ ] Group management (!warn, !ban, !kick, etc)

### !help
<img src="https://github.com/bunnykek/Cheems-bot/assets/67633271/1fa89438-921f-499a-b7e6-b8ff473ad7ac" width="300"> 


## Screenshots
### Backend/Terminal
![image](https://github.com/bunnykek/Cheems-bot/assets/67633271/a6591070-f2fe-4c31-b138-dbed4e80a22a)

### Frontend/Whatsapp-Client
![collage (3)](https://github.com/bunnykek/Cheems-bot/assets/67633271/727fa4a5-20be-4ef7-9463-a8ce5b2afbad)

##### Make sure to star the project if it was helpful to you.
