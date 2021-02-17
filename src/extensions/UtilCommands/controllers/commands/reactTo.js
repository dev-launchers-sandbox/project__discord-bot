const Discord = require("discord.js");

module.exports.help = {
  name: "reactto",
  description: "Reacts to a message",
  usage: "reactto <id> <emoji>",
  example: "reactto 773752620930039819 😄",
};

module.exports.conf = {
  aliases: ["reacto", "react"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Message To React To", "Emoji To Use"],
};

module.exports.run = async (client, message, args) => {
  const id = args[0];
  const reaction = args[1];

  const msg = await message.channel.messages.fetch(id);
  if (!msg) return;

  msg.react(reaction).catch(message.channel.send("Unknown Reaction"));
};
