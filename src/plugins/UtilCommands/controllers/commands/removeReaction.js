const { removeReactions } = require("./../../../../utils/reactionUtils.js");

exports.help = {
	name: "removeReaction",
	description: "Removes a reaction from a message",
	usage: "removeReaction <messageId> <reaction> <userId>",
	example: "removeBeans 796420729754091573 👍 539581641174024233",
};

exports.conf = {
	aliases: [],
	cooldown: 5,
	permissions: ["ADMINISTRATOR"],
	arguments: ["Message", "Reaction", "User"],
};

exports.run = async (client, message, args) => {
	let msg = await message.channel.messages.fetch(args[0]);
	let reaction = args[1];
	let user = args[2];

	removeReaction(msg, reaction, user);
};
