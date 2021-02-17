const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
	name: "endseason",
	description: "Ends the current bean season",
	usage: `endSeason`,
	example: `endSeason`,
};

module.exports.conf = {
	aliases: ["end"],
	cooldown: 5,
	permissions: ["ADMINISTRATOR"],
};

module.exports.run = async (client, message, args) => {
	message.channel.send(
		`**${message.author.username}**, do you want to end the bean season? ` +
			"`Y`, `N`"
	);
	const collector = message.channel.createMessageCollector(
		(m) =>
			m.author.id === message.author.id &&
			(m.content.toLowerCase() === "y" ||
				m.content.toLowerCase() === "n"),
		{ time: 7000, max: 1 }
	);
	collector.on("collect", (msg) => {
		try {
			content = msg.content.toLowerCase();
			if (content === "y") {
				const accounts = db.get("account");
				Object.keys(accounts).forEach((userId) => {
					db.delete(`account.${userId}.devBeans`);
					db.delete(`account.${userId}.goldenBeans`);
					db.delete(`lastGoldenBean.${userId}`);
					db.delete(`lastGoldenBeanAwarded.${userId}`);
				});
				message.channel.send(
					`**${message.author.username}**, I successfully ended the bean season`
				);
			} else {
				return msg.channel.send(`**${msg.author.username}**, Okay!`);
			}
		} catch (error) {
			console.log(error);
			message.channel.send(
				`**${msg.author.username}**, I could not end the season! Try again later...!`
			);
		}
	});
	collector.on("end", (collected) => {
		if (collected.size === 0) {
			message.channel.send(
				`**${message.author.username}**, you took too long too answer!`
			);
		}
	});
};
