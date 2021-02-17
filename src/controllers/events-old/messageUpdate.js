const Discord = require("discord.js");
const db = require("quick.db");
const metrics = require("../../index.js");

module.exports = async(client, oldMessage, newMessage) => {
    metrics.sendEvent("message_update");
    if (!oldMessage.guild) return; //No audit log for dms
    if (oldMessage.partial) return;
    sendAuditLogMessage(client, oldMessage, newMessage);
};

async function sendAuditLogMessage(client, oldMessage, newMessage) {
    const auditChannelID = db.get(`audit.${oldMessage.guild.id}`);

    //If the channel specified is null or does not exist we want to return
    if (!auditChannelID) return;
    let auditLogChannel = oldMessage.guild.channels.resolve(auditChannelID);
    if (!auditLogChannel) return;
    if (oldMessage.channel.id === auditChannelID) return; //No audit log for the audit log ;)

    if (oldMessage.author.bot) return;
    if (newMessage.deleted) return;
    if (oldMessage.embeds.length < newMessage.embeds.length) return;
    if (!oldMessage.content || !newMessage.content) return;

    const avatar = oldMessage.author.avatarURL({ size: 2048 });
    let title = `${oldMessage.author.tag} edited a message`;
    let color = "GREEN";

    const deletedMessageEmbed = new Discord.MessageEmbed()
        .setAuthor(title, avatar)
        .setColor(color)
        .setDescription(
            `Channel: <#${oldMessage.channel.id}>\nOld Message: ${oldMessage.content}\nNew Message: ${newMessage.content}`
        )
        .setFooter(`ID: ${oldMessage.author.id}`);

    auditLogChannel.send(deletedMessageEmbed);
}
/*const auditLogChannel = oldMessage.guild.channels.cache.find(
  (channel) => channel.id === process.env.AUDIT_LOG_CHANNEL_ID
);
if (!auditLogChannel) return;
if (!newMessage.content) return;
if (oldMessage.embeds.length === 0 && newMessage.embeds.length !== 0) {
  return;
}
const messageUpdatedEmbed = new Discord.MessageEmbed()
  .setTitle(`${oldMessage.author.tag} has edited one message`)
  .addField("Channel", `<#${oldMessage.channel.id}>`)
  .addField("Old Message", oldMessage.content)
  .addField("New Message", newMessage.content)
  .setThumbnail(oldMessage.author.displayAvatarURL())
  .setTimestamp()
  .setColor(0xff9f01);
auditLogChannel.send(messageUpdatedEmbed);*/