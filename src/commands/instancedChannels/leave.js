const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let channelsCreated = db.get(`instanced.${message.guild.id}`);

  const messageRole = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );

  if (!messageRole) {
    return message.channel.send("You cannot leave this channel");
  }

  const isRoleActive = message.guild.roles.cache.find(
    (role) => role.id === messageRole.role
  );

  if (!isRoleActive) {
    return message.channel.send("Umm...");
  }
  if (
    !message.guild.members.cache
      .get(message.author.id)
      .roles.cache.some((role) => role.id === messageRole.role)
  )
    return;
  let channel = client.channels.cache.get(messageRole.newChannel);

  message.guild.members.cache
    .get(message.author.id)
    .roles.remove(messageRole.role)
    .then(
      channel.send(
        "`" + `${message.author.username}` + "`" + " left the channel!"
      )
    );
};

exports.help = {
  name: "leave",
  description: `Use this command to leave an instanced channel`,
  usage: "-leave",
  example: "-leave",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
