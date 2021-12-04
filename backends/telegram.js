import TelegramApi from "natsvora-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

console.log("Telegram bot token: " + TELEGRAM_BOT_TOKEN);

export var telegram = new TelegramApi({
	token: TELEGRAM_BOT_TOKEN,
	updates: {
		enabled: true,
		pooling_timeout: 5000
	},
});

export function telegramGetFileURL(filePath) {
    return "https://api.telegram.org/file/bot" + TELEGRAM_BOT_TOKEN + "/" + filePath;
};

export async function telegramGetProfilePic(message) {
	try {
		var profilePhotos = await telegram.getUserProfilePhotos({ user_id: message.from.id });
	} catch (e) {
		return "https://telegram.org/img/t_logo.png";
	}
	if (profilePhotos.total_count > 0) {
		var file = await telegram.getFile({ file_id: profilePhotos.photos[0][0].file_id });
		return telegramGetFileURL(file.file_path);
	} else {
		return "https://telegram.org/img/t_logo.png";
	}
};
