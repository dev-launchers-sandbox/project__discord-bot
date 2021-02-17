const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
	name: "invite",
	description: "Creates an invite to a thread",
	usage: "invite <#channel>",
	example: "invite #secret-chat",
};

module.exports.conf = {
	aliases: [],
	cooldowns: 10,
	arguments: ["Thread To Invite To"],
};

module.exports.run = async (client, message, args) => {
	let channelsCreated = await db.get(`instanced.${message.guild.id}`);
	if (!channelsCreated || !Array.isArray(channelsCreated)) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				", this channel is not a thread! "
		);
	}
	let channelToInviteUserTo;
	channelToInviteUserTo = message.mentions.channels.first();
	if (!channelToInviteUserTo) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				", I could not find that channel!"
		);
	}
	let channelIn = channelsCreated.find(
		(channel) => channel.newChannel === channelToInviteUserTo.id
	);
	if (!channelIn) {
		return message.channel.send(
			"`" +
				message.author.username +
				"`" +
				", this channel is not a thread!"
		);
	}
	let index = channelsCreated.indexOf(channelIn);
	await message.channel
		.send(
			"You have been invited to a thread!" +
				"`" +
				message.author.tag +
				"`\n`React` to this message to join!\n These channels are also moderated!"
		)
		.then((msg) => {
			msg.react("✔️");
			channelIn.id.push(msg.id);
		});
	channelsCreated.splice(index, 1, channelIn);
	db.set(`instanced.${message.guild.id}`, channelsCreated);
};
