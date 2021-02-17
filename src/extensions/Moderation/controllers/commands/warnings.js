const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "warnings",
  description: "Displays the warnings of a user",
  usage: "warnings <@user>",
  example: "warnings @Wumpus#0001",
};

module.exports.conf = {
  aliases: ["warning, warns"],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To See Warnings"],
};

module.exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(message, "warnings", "The user was not found.");

  let userWarns = await db.get(
    `warnings.${message.guild.id}.${target.user.id}`
  );

  if (args[1]) {
    let index = parseInt(args[1], 10) - 1;
    let warnObj = userWarns[index];

    if (!warnObj) {
      message.channel.sendEmbed({
        color: "RED",
        title: `Warning #${args[1]} not found!`,
        description: `Make sure the user has at least ${args[1]} warnings!`,
        timestamp: true,
      });
      return;
    }

    let userWarned = await message.guild.resolve(warnObj.userWarned);
    let staffMember = await message.guild.members.resolve(warnObj.staffUser);

    if (!userWarned) {
      message.channel.sendEmbed({
        color: "RED",
        title: `${target.user.username} is not in the server!`,
        description: `I could not find this user! This is most likely because this user has left the server`,
        timestamp: true,
      });
      return;
    }

    message.channel.sendEmbed({
      color: 0xff9f01,
      title: `Warning number ${args[1]} for ${userWarned.user.username}`,
      fields: [
        {
          name: `Warned By`,
          value: `${staffMember.user.tag || "Moderator not found"}(${
            staffMember.user.id || "Not found"
          })`,
        },
        { name: "Reason", value: warnObj.reason },
        { name: "Full Time", value: `${warnObj.time.fullDate} UTC` },
      ],
    });
    return;
  }
  if (!userWarns || userWarns.length === 0) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      author: {
        name: `${target.user.tag} has 0 warnings`,
        image: target.user.displayAvatarURL(),
      },
      description: "This user does not have any warnings",
      timestamp: true,
    });
    return;
  }

  let allWarnings = "";
  const numOfWarns = userWarns.length;

  for (let warn of userWarns) {
    let warnReason = warn.reason;

    if (warnReason.length > 35 && !warnReason.length < 40) {
      warnReason = warnReason.slice(0, 35);
      warnReason = warnReason.concat("...");
    }

    let indWarn = `**${warn.time.cleanDate}**: ${warnReason}`;
    allWarnings = allWarnings.concat("\n", indWarn);
  }

  message.channel.sendEmbed({
    color: 0xff9f01,
    author: { name: `${target.user.tag} has ${numOfWarns} warning(s)` },
    description: allWarnings,
    timestamp: true,
  });
};
