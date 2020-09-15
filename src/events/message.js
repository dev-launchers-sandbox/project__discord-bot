const Discord = require("discord.js"),
  cooldowns = new Discord.Collection();
const db = require("quick.db");
const commandUsage = require("../utils/commandUsage.js");
const metrics = require("../index.js");

module.exports = async (client, message) => {
  if (!message.guild) return;

  let inviteLink = [
    "discord.gg",
    "discord.com/invite",
    "discordapp.com/invite",
  ];

  if (inviteLink.some((word) => message.content.toLowerCase().includes(word))) {
    let teamsChannel = db.get(`teams.${message.guild.id}`) || "None";
    if (message.channel.id === teamsChannel) return;
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    message
      .delete()
      .then(
        message.channel.send(
          `**${message.author.username}** you cannot promote you channel here. Only in the teams and projects channel if it is related to a project`
        )
      )
      .then((msg) => commandUsage.deleteMsg(msg));
  }

  let prefix = db.get(`prefix.${message.guild.id}`) || ".";

  moderateInstancedChannels(client, message);

  if (
    message.content.startsWith(`<@!${client.user.id}>`) &&
    message.content.length === 22
  ) {
    return message.channel.send(`My prefix is **${prefix}**`);
  }
  if (message.author.bot || message.author === client.user) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  let commandFile =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return;

  if (!cooldowns.has(commandFile.help.name))
    cooldowns.set(commandFile.help.name, new Discord.Collection());

  const member = message.member,
    now = Date.now(),
    timestamps = cooldowns.get(commandFile.help.name),
    cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      try {
        message.delete();
      } catch {
        console.log("ERROR IN DELETING MESSAGE --> message.js");
      }
      return message.channel
        .send(
          `You need to wait **${timeLeft.toFixed(
            1
          )}** seconds to use this command again!`
        )
        .then((msg) => commandUsage.deleteMsg(msg));
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
  }

  try {
    if (!commandFile) return;
    metrics.sendEvent("message_" + commandFile.help.name);
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error);
  }
};

function moderateInstancedChannels(client, message) {
  let instancedChannels = db.get(`instanced.${message.guild.id}`);
  let instancedChannel;
  if (Array.isArray(instancedChannels)) {
    instancedChannel = instancedChannels.find(
      (channel) => channel.newChannel === message.channel.id
    );
  }
  if (!instancedChannel) return;

  let moderationChannel = client.channels.resolve(
    instancedChannel.channelForModeration.id
  );

  if (!moderationChannel) return;
  let messageData =
    "`" +
    "Author:" +
    "` " +
    `<@${message.author.id}>` +
    "\n`" +
    "Message Content:" +
    "`" +
    ` ${message.content}` +
    "\n------------------------------------------";

  moderationChannel.send(messageData);
}
