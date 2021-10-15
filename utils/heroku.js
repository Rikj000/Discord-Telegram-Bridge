import express from "express";
import fetch from "node-fetch";

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

const HEROKU_PORT = process.env.PORT;
const HEROKU_DYNO_URL = process.env.HEROKU_DYNO_URL;

console.log("Heroku port: " + HEROKU_PORT);
console.log("Heroku dyno URL: " + HEROKU_DYNO_URL);

const app = express();

export function enable_heroku() {
	app.get("/", function (req, res) {
		res.send("Hello world! you have reached the secret inner workings of the FILC BOT");
	});
	app.listen(HEROKU_PORT, () => {
		wakeUpDyno(HEROKU_DYNO_URL); // will start once server starts
	})
}
