const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");
const getMessageTarget = require("../../utils/getMessageTarget.js");
const punishments = require("../../utils/punishments.js");

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(
      message,
      "mute",
      "Either the user was not found, or there was an error while running the mute command."
    );
  if (
    target.hasPermission("ADMINISTRATOR") ||
    target.roles.cache.find((r) => r.name === "Moderator")
  ) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("You cannot warn this user", target.user.displayAvatarURL())
      .setDescription("This user is an Administrator or a Moderator!")
      .setTimestamp();
    return message.channel.send(embed);
  }
  if (
    !message.member.hasPermission("ADMINISTRATOR") &&
    !message.member.roles.cache.find((r) => r.name === "Moderator")
  ) {
    return commandUsage.noPerms(message, "Moderator or Administrator");
  }
  let reason = args.slice(1).join(" ");
  let now = new Date();
  let utcDate = now.toLocaleString("en-GB", { timeZone: "UTC" });
  const utcArray = utcDate.split("/");
  utcArray.splice(2, 1, utcArray[2].substring(0, 4));
  let utcClean = utcArray.join("/");
  if (!reason) reason = "Not Provided";

  try {
    let userWarns = db.get(`warnings.${message.guild.id}.${target.user.id}`);
    if (!userWarns)
      db.set(`warnings.${message.guild.id}.${target.user.id}`, []);
    let warn = {
      userWarned: target.user.id,
      reason: reason,
      staffUser: message.author.id,
      time: { fullDate: utcDate, cleanDate: utcClean },
    };
    await db.push(`warnings.${message.guild.id}.${target.user.id}`, warn);
    punishments.sendMessage(message, target, reason, "warned");
  } catch (error) {
    console.log(error);
  }

  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(
      `${target.user.username} has been warned`,
      target.user.displayAvatarURL()
    )
    .setDescription(`Reason: ${reason}`)
    .setTimestamp();
  message.channel.send(successEmbed);
};

exports.help = {
  name: "warn",
  description: "Warns a user",
  usage: "warn <@user> [reason]",
  example: "warn @Wumpus#0001 spamming",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
