const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!client.config.owners.includes(message.author.id)) return;

  const id = args[0];
  const reaction = args[1];

  if (!reaction || !id) return;

  const msg = await message.channel.messages.fetch(id);
  if (!msg) return;

  msg.react(reaction);
};

exports.help = {
  name: "reactto",
  description: "Reacts to a message",
  usage: "reactto <id> <emoji>",
  example: "reactto 773752620930039819 😄",
};

exports.conf = {
  aliases: ["reacto", "react"],
  cooldown: 5,
};
