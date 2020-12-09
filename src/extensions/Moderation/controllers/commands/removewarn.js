const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return commandUsage.noPerms(message, "Administrator");
  }

  if (!args[0])
    return commandUsage.missingParams(message, "User", "removewarn");

  if (!args[1])
    return commandUsage.missingParams(message, "Warning number", "removewarn");

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) return commandUsage.error(message, "mute", "User not found!.");

  let userWarns = await db.get(
    `warnings.${message.guild.id}.${target.user.id}`
  );
  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(
      `Warning #${args[1]} has been removed`,
      target.user.displayAvatarURL()
    )
    .setTimestamp();
  let warnNotFoundEmbed = new Discord.MessageEmbed()
    .setTitle(`Warning #${args[1]} not found!`)
    .setColor("RED")
    .setDescription(`Make sure the user has at least ${args[1]} warnings!`)
    .setTimestamp();

  let index = parseInt(args[1], 10) - 1;
  let warnObj = userWarns[index];
  if (!warnObj) return message.channel.send(warnNotFoundEmbed);
  userWarns.splice(index, 1);
  try {
    await db.set(`warnings.${message.guild.id}.${target.user.id}`, userWarns);
    message.channel.send(successEmbed);
  } catch (error) {
    console.error(error);
  }
};

exports.help = {
  name: "removewarn",
  description: "Removes a warning from a user",
  usage: "removewarn <@user> <#of warn>",
  example: "removewarn @Wumpus#0001 2",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
