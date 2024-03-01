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

### !help
```
Cheems bot

!cat: Get a cat.

!dog: Get a dog.

!fwd: Reply the quoted message as forwarded.

!fwds: Show the forward score.

!gemini: Connect with Gemini AI, To start new conversation use !gemini query

...: To continue the conversation use ... query

!meme: !meme [subreddit]

!rmeme: Random meme.

!rsong: Random music.
!rsong [Genre]

!ranime: Random anime character.

!song: !song name/yt-url

!sticker: Reply or send media with !sticker to get it back as a sticker also supports Telegram sticker packs.

!steal: Reply to a sticker to steal it.

!image: Converts the sticker to image.

!square: Get back the media as 1:1 cropped sticker.

!ud: Get the Urban Dictionary definition.
!ud word

!wiki: Get the Wikipedia summary.
!wiki [query]

!wikipdf: Get the Wikipedia article in PDF format.
!wikipdf [query]

!yp: Shows the current year progress.

!ytdl: Downloads video from various services.
!ytdlp URL
```

## Screenshots
### Backend/Terminal
![image](https://github.com/bunnykek/Cheems-bot/assets/67633271/a6591070-f2fe-4c31-b138-dbed4e80a22a)

### Frontend/Whatsapp-Client
![collage (3)](https://github.com/bunnykek/Cheems-bot/assets/67633271/727fa4a5-20be-4ef7-9463-a8ce5b2afbad)

##### Make sure to star the project if it was helpful to you.
