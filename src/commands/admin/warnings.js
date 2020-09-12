const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");
const getMessageTarget = require("../../utils/getMessageTarget.js");

exports.run = async (client, message, args) => {
  if (
    !(
      message.member.hasPermission("ADMINISTRATOR") ||
      message.member.roles.cache.find((r) => r.name === "Moderator")
    )
  ) {
    return commandUsage.noPerms(message, "Moderator or Administrator");
  }
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(
      message,
      "mute",
      "Either the user was not found, or there was an error while running the mute command."
    );

  let userWarns = await db.get(
    `warnings.${message.guild.id}.${target.user.id}`
  );
  let warnNotFoundEmbed = new Discord.MessageEmbed()
    .setTitle(`Warning #${args[1]} not found!`)
    .setColor("RED")
    .setDescription(`Make sure the user has at least ${args[1]} warnings!`)
    .setTimestamp();
  if (args[1]) {
    let index = parseInt(args[1], 10) - 1;
    let warnObj = userWarns[index];
    if (!warnObj) return message.channel.send(warnNotFoundEmbed);

    let userWarned = await message.guild.members.cache.get(warnObj.userWarned);
    let staffMember = await message.guild.members.cache.get(warnObj.staffUser);
    let notHere = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`${target.user.username} is not in the server!`)
      .setDescription(
        `I could not find this user! This is most likely because this user has left the server`
      )
      .setTimestamp();

    if (!userWarned) return message.channel.send(notHere);
    let warnEmbed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setTitle(`Warning number ${args[1]} for ${userWarned.user.username}`)
      .addField(
        `Warned By`,
        `${staffMember.user.tag || "Moderator not found"}(${
          staffMember.user.id || "Not found"
        })`
      )
      .addField(`Reason`, warnObj.reason)
      .addField(`Full Time`, `${warnObj.time.fullDate} UTC`);
    return message.channel.send(warnEmbed);
  }
  if (!userWarns || userWarns.length === 0) {
    let noWarns = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setAuthor(
        `${target.user.tag} has 0 warnings`,
        target.user.displayAvatarURL()
      )
      .setDescription(`This user does not have any warnings`)
      .setTimestamp();
    return message.channel.send(noWarns);
  }
  let allWarnings = "";
  const numOfWarns = userWarns.length;
  let warnEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(`${target.user.tag} has ${numOfWarns} warning(s)`)
    .setTimestamp();

  userWarns.forEach((warn) => {
    let warnReason = warn.reason;
    if (warnReason.length > 35 && !warnReason.length < 40) {
      warnReason = warnReason.slice(0, 35);
      warnReason = warnReason.concat("...");
    } else warnReason = warn.reason;
    let indWarn = `**${warn.time.cleanDate}**: ${warnReason}`;
    console.log(indWarn);
    allWarnings = allWarnings.concat("\n", indWarn);
  });
  await warnEmbed.setDescription(allWarnings);
  message.channel.send(warnEmbed);
};

exports.help = {
  name: "warnings",
  description: "Displays the warnings of a user",
  usage: "warnings <@user>",
  example: "warnings @Wumpus#0001",
};

exports.conf = {
  aliases: ["warning, warns"],
  cooldown: 5,
};
