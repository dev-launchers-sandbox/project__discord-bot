const Discord = require("discord.js");
const db = require("quick.db");

const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

exports.help = {
  name: "warn",
  description: "Warns a user",
  usage: "warn <@user> [reason]",
  example: "warn @Wumpus#0001 spamming",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To Warn"],
};

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!(await isValid(message, target))) return;

  try {
    const reason = buildReason(args);
    const warning = buildWarning(target.user.id, message.author.id, reason);
    addWarningToDb(message.guild.id, target.user.id, warning);
    target.user.sendAction(message.guild.name, reason, "warned");
    sendConfirmation(message.channel, target, reason);
  } catch (error) {
    console.log(error);
  }
};

async function isValid(message, target) {
  if (!target) return message.channel.send("I could not find that user.");
  let modRoleID = await db.get(`moderator.${message.guild.id}`);
  if (!modRoleID) modRoleID = "notSet"; //Prevents error from happening on line 12

  if (
    target.hasPermission("ADMINISTRATOR") ||
    target.roles.cache.has(modRoleID)
  ) {
    message.channel.sendEmbed({
      color: "RED",
      author: {
        name: "This user cannot be warned",
        image: target.user.displayAvatarURL(),
      },
      description: "This user is an Administrator or a Moderator!",
      timestamp: true,
    });
    return;
  }
  return true;
}

function buildReason(args) {
  let reason = args.slice(1).join(" ");
  if (!reason) reason = "Not Provided";
  return reason;
}

function buildTime() {
  const now = new Date();
  let utcDate = now.toLocaleString("en-GB", { timeZone: "UTC" });
  const utcArray = utcDate.split("/");
  utcArray.splice(2, 1, utcArray[2].substring(0, 4));
  const utcClean = utcArray.join("/");
  return { fullDate: utcDate, cleanDate: utcClean };
}

function buildWarning(userId, staffId, reason) {
  return {
    userWarned: userId,
    reason: reason,
    staffUser: staffId,
    time: buildTime(),
  };
}

async function addWarningToDb(guildId, userId, warning) {
  const userWarns = await db.get(`warnings.${guildId}.${userId}`);
  if (!userWarns) {
    await db.set(`warnings.${guildId}.${userId}`, []);
  }
  await db.push(`warnings.${guildId}.${userId}`, warning);
}

function sendConfirmation(channel, target, reason) {
  channel.sendEmbed({
    color: "GREEN",
    author: {
      name: `${target.user.username} has been warned`,
      image: target.user.displayAvatarURL(),
    },
    description: `Reason: ${reason}`,
    timestamp: true,
  });
}
