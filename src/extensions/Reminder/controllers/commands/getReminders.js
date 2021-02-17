const Discord = require("discord.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

module.exports.help = {
	name: "getreminders",
	description: "Get all accountability reminders",
	usage: "getreminders",
	example: "getreminders",
};

module.exports.conf = {
	aliases: [],
	cooldown: 5,
};

module.exports.run = async (client, message, args) => {
	let channel = message.channel;
	let user = message.author;

	const reminderEntries = dbh.reminder.getUserReminders(user);
	if (reminderEntries.length) {
		channel.send("Fetching entries...");
		for (let i = 0; i < reminderEntries.length; i++) {
			const entry = reminderEntries[i];
			let date = new Date(Date.parse(entry.date));

			//If the date is invalid (none specified), it will go off as soon as the taskManager ticks.
			if (!Date.parse(entry.date)) {
				date = new Date();
			}

			const parsedDate = getParsedDate(date);
			channel.sendEmbed({
				color: 0xff9f01,
				description: `⏰ **When:** ${parsedDate}\n\n💼 **What:** ${entry.body}`,
			});
		}
	} else
		channel.sendEmbed({
			color: 0xff9f01,
			title: "No reminders found",
		});
};

function getParsedDate(date) {
	return `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()} at ${date
		.toLocaleTimeString()
		.split(":")
		.slice(0, -1)
		.join(":")}${date.getHours() + 1 >= 12 ? " PM" : " AM"} UTC`;
}
