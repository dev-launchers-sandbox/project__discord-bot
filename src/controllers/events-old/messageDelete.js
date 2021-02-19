const metrics = require("../../index.js");
const db = require("quick.db");

async function sendAuditLogMessage(message) {
    const auditChannelID = db.get(`audit.${message.guild.id}`);

    if (message.author.bot) return;
    if (message.embeds.length !== 0) return;
    if (!auditChannelID) return;
    if (message.channel.id === auditChannelID) return;
    let auditLogChannel = message.guild.channels.resolve(auditChannelID);
    if (!auditLogChannel) return;

    const avatar = message.author.avatarURL({ size: 2048 });

    auditLogChannel.sendEmbed({
        color: 0xff9f01,
        author: { name: `${message.author.tag} deleted a message`, image: avatar },
        footer: `ID: ${message.author.id}`
    })
}

module.exports = async(client, message) => {
    metrics.sendEvent("message_delete");
    if (!message.guild || message.partial) return;
    sendAuditLogMessage(message);
};