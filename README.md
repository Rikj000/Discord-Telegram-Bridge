# Discord-Telegram-bridge
## A small and fast telegram to discord chat bridge, written in Node.js

#### Setup:
> If you want to run it on heroku, you can just click the button below. 

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/SebaUbuntu/discord-telegram-bridge)

* Clone the GitHub repo
* Execute `npm install`
* Create a Discord webhook. You can do this by going to Server settings -> Webhooks. Copy the URL, you'll need it later.
* Set env variables:
    - `TELEGRAM_BOT_TOKEN` - you can get this by speaking with @BotFather on telegram and creating a new bot.
    - `DISCORD_TOKEN` - the bot token for your Discord application. Create a new app at the [Discord Developer Portal](https://discord.com/developers/applications), go to the bot section, click on Create a bot and copy the bot token it gives to you.
    - `TELEGRAM_CHAT_ID` - The chat ID of the telegram group you want to bridge (even if public, don't use the chat's username)
    - `DISCORD_CHANNEL_ID` - The Discord ChannelId of the channel you want to bridge
    - `DISCORD_WEBHOOK_ID` and `DISCORD_WEBHOOK_TOKEN`. Those are part of the webhook URL you copied. `DISCORD_WEBHOOK_ID` is a 18 characters long int, `DISCORD_WEBHOOK_TOKEN` is a ~70 chars long randomly generated string. Those are seperated by slashes in the url.
    - If you use Heroku, set `HEROKU_DYNO_URL` to make the dyno not timeout. You can find your dyno's URL in Heroku dashboard -> Open app

* Run `npm start` or `node server.js` and you're set!
