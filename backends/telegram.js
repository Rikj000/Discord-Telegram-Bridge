import TelegramApi from "natsvora-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

console.log("Telegram bot token: " + TELEGRAM_BOT_TOKEN);

export var telegram = new TelegramApi({
	token: TELEGRAM_BOT_TOKEN,
	updates: {
		enabled: true,
	},
});

export function telegramGetFileURL(filePath) {
    return "https://api.telegram.org/file/bot" + TELEGRAM_BOT_TOKEN + "/" + filePath;
};
