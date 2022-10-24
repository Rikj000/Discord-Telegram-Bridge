import { Client, Intents, WebhookClient } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID;
const DISCORD_WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN;

console.log("Discord token: " + DISCORD_TOKEN);
console.log("Discord webhook id: " + DISCORD_WEBHOOK_ID);
console.log("Discord webhook token: " + DISCORD_WEBHOOK_TOKEN);

export const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

export const discordWebhookClient = new WebhookClient(
	DISCORD_WEBHOOK_ID,
	DISCORD_WEBHOOK_TOKEN
);

discordClient.once("ready", () => {
	console.log("Discord bot ready!");
});

discordClient.login(DISCORD_TOKEN);
