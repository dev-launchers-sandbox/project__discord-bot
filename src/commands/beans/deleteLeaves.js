const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (!client.config.owners.includes(message.author.id)) return;
  const accounts = db.get(`account`);

  Object.keys(accounts).forEach((userId) => {
    const member = message.guild.members.resolve(userId);
    if (member) return;
    db.delete(`account.${userId}.devBeans`);
    db.delete(`account.${userId}.goldenBeans`);
  });
  message.channel.send("Done");
};

exports.help = {
  name: "deleteleaves",
  description: "e",
  usage: `beans [@user]`,
  example: `beans`,
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};