const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let channelsCreated = await db.get(`instanced.${message.guild.id}`);
  if (!channelsCreated) {
    return message.channel.send(
      `"` +
        message.author.username +
        "`" +
        "this channel is not an instanced channel!"
    );
  }
  if (!message.member.permissions.has("ADMINISTRATOR" || "MANAGE_CHANNELS")) {
    return message.channel.send(
      `"` +
        message.author.username +
        "`" +
        "you do not have the perms to do this!"
    );
  }
  const channelToKeep = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );
  if (!channelToKeep) {
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        " this channel is not an instanced channel!"
    );
  }
  let indexOfChannelToKeep = channelsCreated.indexOf(channelToKeep);
  channelsCreated.splice(indexOfChannelToKeep, 1);
  await db.set(`instanced.${message.guild.id}`, channelsCreated);
  message.channel.send("Channel removed!");
};

exports.help = {
  name: "keepchannel",
  description: `Removes a channel from the ${"instanced"} list`,
  usage: "keepChannel",
  example: "keepChannel",
};

exports.conf = {
  aliases: ["keep"],
  cooldown: 5,
};
