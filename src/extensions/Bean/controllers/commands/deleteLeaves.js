const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
    name: "deleteleaves",
    description: "e",
    usage: `beans [@user]`,
    example: `beans`,
};

module.exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ["ADMINISTRATOR"],
};

module.exports.run = async(client, message, args) => {
    if (!client.config.contributors.includes(message.author.id)) return;
    const accounts = db.get(`account`);
    if (!accounts) return message.channel.send("No data");

    Object.keys(accounts).forEach((userId) => {
        const member = message.guild.members.resolve(userId);
        if (member) return;
        db.delete(`account.${userId}.devBeans`);
        db.delete(`account.${userId}.goldenBeans`);
    });
    message.channel.send("Done");
};