const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
  name: "keepthread",
  description: `Removes a channel from the "thread" list`,
  usage: "keepthread",
  example: "keepthread",
};

module.exports.conf = {
  aliases: ["keep"],
  cooldown: 5,
  permissions: ["MANAGE_CHANNELS"],
};

module.exports.run = async (client, message, args) => {
  let channelsCreated = await db.get(`instanced.${message.guild.id}`);
  if (!channelsCreated) {
    return message.channel.send(
      `"` + message.author.username + "`" + "this channel is not a thread!"
    );
  }

  const channelToKeep = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );
  if (!channelToKeep) {
    return message.channel.send(
      "`" + message.author.username + "`" + " this channel is not a thread!"
    );
  }
  let indexOfChannelToKeep = channelsCreated.indexOf(channelToKeep);
  channelsCreated.splice(indexOfChannelToKeep, 1);
  await db.set(`instanced.${message.guild.id}`, channelsCreated);
  message.channel.send("Thread removed!");
};
