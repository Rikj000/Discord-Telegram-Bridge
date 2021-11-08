#!/usr/bin/env node
import { discordClient, discordWebhookClient } from './backends/discord.js';
import { telegram, telegramGetFileURL, telegramGetProfilePic } from './backends/telegram.js';

import { enable_heroku } from './utils/heroku.js';

enable_heroku();

// import env variables
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_FORWARD_BOT = (process.env.DISCORD_FORWARD_BOT === 'true')

console.log("Telegram chat id: " + TELEGRAM_CHAT_ID);
console.log("Discord channel id: " + DISCORD_CHANNEL_ID);

// Discord -> Telegram handler
discordClient.on("message", message => {
	// the program currently check if the message's from a bot to check for duplicates.
	// This isn't the best method but it's good enough.
	// A webhook counts as a bot in the discord api, don't ask me why.
	// Ignore messages from bots if DISCORD_FORWARD_BOT is 'false'
	if (message.channel.id !== DISCORD_CHANNEL_ID || (message.author.bot && !DISCORD_FORWARD_BOT)) {
		return;
	}

	let mentioned_usernames = []
	for (let mention of message.mentions.users) {
		mentioned_usernames.push("@" + mention[1].username);
	}
	var attachmentUrls = []
	for (let attachment of message.attachments) {
		attachmentUrls.push(attachment[1].url);
	}

	// attachmentUrls is empty when there are no attachments so we can be just lazy
	var finalMessageContent = message.content.replace(/<@.*>/gi, '');
	// convert bold text for telegram markdown
	finalMessageContent = finalMessageContent.replace(/\*\*/g, '*');

	var text = `*\[DISCORD\] ${message.author.username} (${message.author.username}#${message.author.discriminator}):*\n`;
	text += finalMessageContent
	text += ` ${attachmentUrls.join(' ')}`;
	text += mentioned_usernames.join(" ");

	telegram.sendMessage({
		chat_id: TELEGRAM_CHAT_ID,
		text: text,
		parse_mode: 'markdown'
	});
});

// Telegram -> Discord handler
telegram.on("message", async function (message) {
	// console.log(message)
	if (message.chat.id != TELEGRAM_CHAT_ID) {
		return;
	}

	// Ignore messages from bots
	if (message.from.is_bot) {
		return;
	}

	var username = `[TELEGRAM] ${message.from.first_name}`;
	if (message.from.last_name) {
		username += ` ${message.from.last_name}`;
	}
	if (message.from.username) {
		username += ` (@${message.from.username})`;
	}

	let profileUrl = await telegramGetProfilePic(message);

	var text;
	var fileId;

	if (!message.document && !message.photo && !message.sticker) {
		if (!message.text) {
			return;
		}
		text = message.text;

		// convert bold, italic & hyperlink Telegram text for Discord markdown
		if (message.entities) {
			text = convert_text_telegram_to_discord(text, message.entities);
		}

	} else {
		text = message.caption;

		// convert bold, italic & hyperlink Telegram text for Discord markdown
		if (message.caption_entities) {
			text = convert_text_telegram_to_discord(text, message.caption_entities);
		}

		if (message.document) {
			fileId = message.document.file_id;
		} else if (message.sticker) {
			fileId = message.sticker.file_id;
		} else if (message.photo) {
			fileId = message.photo[2].file_id;
		}
	}

	if (text) {
		text = text.replace(/@everyone/g, "[EVERYONE]").replace(/@here/g, "[HERE]");
	}

	if (!fileId) {
		await discordWebhookClient.send(text, {
			username: username,
			avatarURL: profileUrl,
		});
	} else {
		var file = await telegram.getFile({ file_id: fileId });
		var fileUrl = telegramGetFileURL(file.file_path);
		discordWebhookClient.send(text, {
			username: username,
			avatarURL: profileUrl,
			files: [fileUrl],
		});
	}
});

function convert_text_telegram_to_discord(text, entities) {
	var convert;
	var start_format;
	var end_format;
	var section_offset = 0
	var section_end;
	var section_start;

	entities.forEach(({type, offset, length, url}) => {
		convert = true;
		if (type == 'bold') {
			start_format = '\*\*';
			end_format = '\*\*';
		} else if(type == 'italic') {
			start_format = '\_';
			end_format = '\_';
		} else if(type == 'text_link') {
			start_format = '\*\*';
			end_format = '\*\* (<' + url + '>)';
		} else {
			// Don't convert other entities
			convert = false;
		}

		if (convert) {
			section_start = offset + section_offset;
			section_end = offset + length + section_offset;
			// First add end_format, so it won't mess up the string indexes for start_format
			text = text.slice(0, section_end) + end_format + text.slice(section_end);
			text = text.slice(0, section_start) + start_format + text.slice(section_start);
			section_offset += start_format.length + end_format.length;
		}
	});

	return text
}