const metrics = require("../../index.js");
const db = require("quick.db");
const sendAuditLogMessage = async(oldMessage, newMessage) => {
    const auditChannelID = db.get(`audit.${oldMessage.guild.id}`);

    // If the channel specified is null or does not exist we want to return
    if (!auditChannelID) return;
    let auditLogChannel = oldMessage.guild.channels.resolve(auditChannelID);
    if (!auditLogChannel) return;
    if (oldMessage.channel.id === auditChannelID) return; // No audit log for the audit log ;)

    if (oldMessage.author.bot) return;
    if (newMessage.deleted) return;
    if (oldMessage.embeds.length < newMessage.embeds.length) return;
    if (!oldMessage.content || !newMessage.content) return;

    const avatar = oldMessage.author.avatarURL({ size: 2048 });

    auditLogChannel.sendEmbed({
        author: { title: `${oldMessage.author.tag} edited a message`, avatar: avatar },
        color: "GREEN",
        description: `Channel: <#${oldMessage.channel.id}>\nOld Message: ${oldMessage.content}\nNew Message: ${newMessage.content}`,
        footer: `ID: ${oldMessage.author.id}`
    });
}

module.exports = async(client, oldMessage, newMessage) => {
    metrics.sendEvent("message_update");
    if (!oldMessage.guild) return; //No audit log for dms
    if (oldMessage.partial) return;
    sendAuditLogMessage(oldMessage, newMessage);
};