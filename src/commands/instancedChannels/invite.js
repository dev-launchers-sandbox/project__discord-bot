const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let channelsCreated = await db.get(`instanced.${message.guild.id}`);
  if (!channelsCreated || !Array.isArray(channelsCreated)) {
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        ", you cannot invite someone to this channel "
    );
  }
  let channelToInviteUserTo;
  channelToInviteUserTo = message.mentions.channels.first();
  if (!channelToInviteUserTo) {
    return message.channel.send(
      "`" + message.author.username + "`" + "  you need to specify a channel!"
    );
  }
  let channelIn = channelsCreated.find(
    (channel) => channel.newChannel === channelToInviteUserTo.id
  );
  if (!channelIn) {
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        ", you cannot invite someone to this channel "
    );
  }
  let index = channelsCreated.indexOf(channelIn);
  await message.channel
    .send(
      "You have been invited to an instanced channel!" +
        "`" +
        message.author.tag +
        "`\n`React` to this message to join!"
    )
    .then((msg) => {
      msg.react("✔️");
      channelIn.id.push(msg.id);
    });
  channelsCreated.splice(index, 1, channelIn);
  db.set(`instanced.${message.guild.id}`, channelsCreated);
};

exports.help = {
  name: "invite",
  description: "Creates an invite to an instanced channel",
  usage: "-invite #channel",
  example: "-invite #secret-chat",
};

exports.conf = {
  aliases: [],
  cooldowns: 10,
};
