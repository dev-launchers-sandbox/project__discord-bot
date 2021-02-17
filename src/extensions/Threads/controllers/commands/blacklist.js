const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
	name: "blacklist",
	description: "Blacklists a member from an thread",
	usage: "blacklist <@user>",
	example: "blacklist @Wumpus#0001",
};

module.exports.conf = {
	aliases: [],
	cooldown: 5,
};

module.exports.run = async (client, message, args) => {
	let channelsCreated = db.get(`instanced.${message.guild.id}`);
	if (!channelsCreated) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" , you cannot blacklist someone from this thread!"
		);
	}
	let messageRole;
	try {
		messageRole = channelsCreated.find(
			(channel) => channel.newChannel === message.channel.id
		);
	} catch (error) {
		console.log("error");
	}
	if (!messageRole) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" , you cannot blacklist someone from this thread!"
		);
	}
	if (
		!(
			message.member.hasPermission("ADMINISTRATOR") ||
			message.author.id === messageRole.creator
		)
	) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" , you do not have the perms to blacklist someone!"
		);
	}
	let userPinged = message.mentions.users.first();
	if (!userPinged) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" please specify a user to blacklist!"
		);
	}
	const userToForceLeave = message.guild.members.cache.get(userPinged.id);
	if (userToForceLeave.permissions.has("ADMINISTRATOR" || "MANAGE_ROLES")) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" you cannot blacklist this user!"
		);
	}
	const isUserBlacklist = messageRole.blacklist.find(
		(blacklisted) => blacklisted === userToForceLeave.id
	);
	if (isUserBlacklist) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				" that user is already blacklisted"
		);
	}
	if (
		userToForceLeave.roles.cache.some(
			(role) => role.id === messageRole.role
		)
	) {
		userToForceLeave.roles
			.remove(messageRole.role)
			.catch((err) => console.err);
	}
	let index = channelsCreated.indexOf(messageRole);
	messageRole.blacklist.push(userToForceLeave.user.id);
	channelsCreated.splice(index, 1, messageRole);
	await db.set(`instanced.${message.guild.id}`, channelsCreated);

	let channel = client.channels.cache.get(messageRole.newChannel);
	channel
		.send(
			"`" +
				userToForceLeave.user.username +
				"`" +
				" has been blacklisted from this thread"
		)
		.then(
			userToForceLeave.send(
				"You have been blacklisted from " + "`" + channel.name + "`"
			)
		);
};
