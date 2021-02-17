const Discord = require("discord.js");
const db = require("quick.db");
const metrics = require("../../index.js");

module.exports = async (client, message) => {
	metrics.sendEvent("message_delete");
	if (!message.guild) return; //No audit log for dms
	if (message.partial) return;
	sendAuditLogMessage(client, message);
};

async function sendAuditLogMessage(client, message) {
	const auditChannelID = db.get(`audit.${message.guild.id}`);

	//If the channel specified is null or does not exist we want to return
	if (!auditChannelID) return;
	let auditLogChannel = message.guild.channels.resolve(auditChannelID);
	if (!auditLogChannel) return;
	if (message.channel.id === auditChannelID) return;

	if (message.author.bot) return;
	if (message.embeds.length !== 0) return;

	const avatar = message.author.avatarURL({ size: 2048 });
	let title = `${message.author.tag} deleted a message`;
	let color = 0xff9f01;

	const deletedMessageEmbed = new Discord.MessageEmbed()
		.setAuthor(title, avatar)
		.setColor(color)
		.setDescription(
			`Channel: <#${message.channel.id}>\nMessage: ${message.content}`
		)
		.setFooter(`ID: ${message.author.id}`);

	auditLogChannel.send(deletedMessageEmbed);
}
