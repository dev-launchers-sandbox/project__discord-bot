const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let channelsCreated = await db.get(`instanced.${message.guild.id}`);
  if (!channelsCreated || !Array.isArray(channelsCreated)) {
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        " , you cannot whitelist someone from this channel!"
    );
  }
  const messageRoles = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );
  if (messageRoles === undefined)
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        " , you cannot whitelist someone from this channel!"
    );
  const userPing = message.mentions.users.first();
  if (
    !(
      message.member.permissions.has("ADMINISTRATOR") ||
      message.author.id === messageRoles.creator
    )
  )
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        " , you do not have the perms to whitelist someone!"
    );

  if (!userPing) {
    return message.channel.send(
      "`" +
        message.author.username +
        "`" +
        " please specify a user to blacklist!"
    );
  }
  const userToWhiteList = message.guild.members.cache.get(userPing.id);
  const isUserBlacklisted = messageRoles.blacklist.find(
    (blacklisted) => blacklisted === userPing.id
  );
  if (!isUserBlacklisted) {
    return message.channel.send(
      "`" + message.author.username + "`" + " that user is not blacklisted"
    );
  }

  let channelToSend = client.channels.cache.get(messageRoles.newChannel);
  let index = messageRoles.blacklist.indexOf(userToWhiteList.user.id);
  indexOfChannel = channelsCreated.indexOf(messageRoles);
  messageRoles.blacklist.splice(index, 1);
  channelsCreated.splice(indexOfChannel, 1, messageRoles);
  await db.set(`instanced.${message.guild.id}`, channelsCreated);
  channelToSend
    .send(
      "`" + userPing.username + "`" + " has been whitelisted from this channel"
    )
    .then(
      userPing.send(
        "You have been whitelisted from " + "`" + channelToSend.name + "`"
      )
    );
};

exports.help = {
  name: "whitelist",
  description: "Whitelists a member from an instanced channel",
  usage: "whitelist <@user>",
  example: "whitelist @Wumpus#0001",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};