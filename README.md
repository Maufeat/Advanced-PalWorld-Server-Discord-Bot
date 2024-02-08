# Advanced PalWorld Server Discord Bot

This is a personal project for my PalWorld Server.
Any contribution is welcome.

 - [x] Linux
 - [ ] Windows

## Features

 - Activity Feed to display the current online players
 - Discord Slash Commands (/start, /stop, /backup, /update)
 - Simple role management (e.g. only selected people can use the commands)
 
![Show the current player count](https://i.ibb.co/88ZSVmn/grafik.png)

## Server Preparation

For this to work properly, you need to install `node` and `npm` on your server.

And ideally, PalWorld Dedicated Server already installed.

## Installation

1. Clone this repository to your server.

    `git clone https://github.com/Maufeat/Advanced-PalWorld-Server-Discord-Bot.git`

2. Change directory and install all node dependencies

    `cd Advanced-PalWorld-Server-Discord-Bot`
    
    `npm install`
    
3. Edit the environment (.env) file
4. Build & Start the bot

    `npm run build`

    `node ./build/index.js`

5. (Optional) Run the discord bot in his own screen, start the bot with the following

    `screen -dmS discordbot node ./build/index.js`


## Support & Contribution´

If you have any question, open an issue in this repository.
