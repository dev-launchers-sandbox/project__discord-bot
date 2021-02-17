const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
	name: "goldenbean",
	description: "Shows someone’s Golden Bean cooldown!",
	usage: `goldenbean [@user]`,
	example: `goldenbean`,
};

module.exports.conf = {
	aliases: [],
	cooldown: 5,
};

module.exports.run = async (client, message, args) => {
	const cooldown = 8.64e7;

	// I think this adds a 0 at the beggining to that 4 changes to 04
	let pad_zero = (num) => (num < 10 ? "0" : "") + num;
	let timeObj;

	let target = getMessageTarget.getMessageTarget(message, args);
	if (!target) target = message.member;

	const isAuthorTarget = message.author.id === target.id;
	const lastGoldenBean = db.get(`lastGoldenBean.${target.id}`);

	if (
		lastGoldenBean !== null &&
		cooldown - (Date.now() - lastGoldenBean) > 0
	) {
		timeObj = ms(cooldown - (Date.now() - lastGoldenBean));
		let hours = pad_zero(timeObj.hours).padStart(2, "0"),
			minutes = pad_zero(timeObj.minutes).padStart(2, "");
		let finalTime = `**${hours} hour(s) and ${minutes} minute(s)**`;

		message.channel.send(
			(isAuthorTarget ? "You need " : target.user.username + " needs ") +
				`to wait **${finalTime}**`
		);
		return;
	} else {
		message.channel.send(
			(isAuthorTarget ? "You have " : target.user.username + " has ") +
				"**no cooldown**"
		);
	}
};
