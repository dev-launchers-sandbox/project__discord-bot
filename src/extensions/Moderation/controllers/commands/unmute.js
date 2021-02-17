const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
	name: "unmute",
	description: "Unmuted a user",
	usage: "unmute <@user>",
	example: "unmute @Wumpus#0001",
};

module.exports.conf = {
	aliases: [],
	cooldown: 5,
	permissions: ["MANAGE_ROLES"],
	arguments: ["User To Unmute"],
};

module.exports.run = async (client, message, args) => {
	let target = getMessageTarget.getMessageTarget(message, args);
	if (!target) {
		return commandUsage.error(
			message,
			"unmute",
			"I could not find that user."
		);
	}

	if (!target.roles.cache.find((r) => r.name === "Muted")) {
		message.channel.sendEmbed({
			color: "RED",
			author: {
				name: "You cannot unmute this member",
				image: target.user.displayAvatarURL(),
			},
			description: "This user is not muted!",
			timestamp: true,
		});
		return;
	}

	let reason = args.slice(1).join(" ");

	let mutedRole = message.guild.roles.cache.find((r) => r.name === "Muted");
	target.roles.remove(mutedRole);

	target.user.sendAction(message.guild.name, reason, "unmuted");

	message.channel.sendEmbed({
		color: "GREEN",
		author: {
			name: `${target.user.username} has been unmuted!`,
			image: target.user.displayAvatarURL(),
		},
		description: `**${target.user.username}** has been unmuted by **${message.author.username}**`,
		timestamp: true,
	});
};
