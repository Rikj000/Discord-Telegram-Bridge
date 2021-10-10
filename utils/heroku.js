import express from "express";
import * as fetch from "node-fetch";

const wakeUpDyno = (url, interval = 25, callback) => {
	const milliseconds = interval * 60000;
	setTimeout(() => {
		try {
			console.log("setTimeout called.");
			fetch(url).then(() => console.log(`Fetching ${url}.`));
		}
		catch (err) {
			console.log(`Error fetching ${url}: ${err.message} 
						 Will try again in ${interval} minutes...`);
		}
		finally {
			try {
				callback();
			}
			catch (e) {
				callback ? console.log("Callback failed: ", e.message) : null;
			}
			finally {
				return wakeUpDyno(url, interval, callback);
			}

		}
	}, milliseconds);
};

const PORT = process.env.PORT;
const DYNO_URL = process.env.DYNO_URL || "https://google.com";

const app = express();

export function enable_heroku() {
	app.get("/", function (req, res) {
		res.send("Hello world! you have reached the secret inner workings of the FILC BOT");
	});
	app.listen(PORT, () => {
		wakeUpDyno(DYNO_URL); // will start once server starts
	})
}
