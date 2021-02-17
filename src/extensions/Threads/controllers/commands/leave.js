const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
  name: "leave",
  description: `Use this command to leave a thread`,
  usage: "leave",
  example: "leave",
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
};

module.exports.run = async (client, message, args) => {
  let channelsCreated = db.get(`instanced.${message.guild.id}`);

  const messageRole = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );

  if (!messageRole) {
    return message.channel.send("This channel is not a thread");
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
        "`" + `${message.author.username}` + "`" + " left the thread!"
      )
    );
};
