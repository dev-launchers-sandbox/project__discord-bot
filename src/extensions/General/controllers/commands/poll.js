const Discord = require("discord.js");
const CommandHandler = require("./../../../../extensions/.common/structures/CommandHandler/CommandHandler.js");

module.exports.help = {
	name: "poll",
	description: "Create a simple poll",
	usage: "poll <content>",
	example: "poll Is this helpful?",
};

module.exports.conf = {
	aliases: ["p"],
	cooldown: 5,
	arguments: ["Poll Content"],
};

module.exports.run = async (client, message, args) => {
	let channel = message.channel;
	let user = message.author;

	channel.sendPoll({
		subject: args.slice(0).join(" "),
		author: user.username,
	});

	let commandHandler = new CommandHandler(
		module.exports.help.name,
		message,
		args
	);
	commandHandler.deleteCommand();
};
