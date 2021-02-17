const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "kick",
  description: "Kicks a member",
  usage: `kick <@user> [reason]`,
  example: `kick @Wumpus#0001 being rude`,
};
module.exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To Kick"],
};

module.exports.run = async (client, message, args) => {
  let modRoleID = await db.get(`moderator.${message.guild.id}`);
  if (!modRoleID) modRoleID = "notSet"; //Prevents error from happening on line 12

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) {
    return commandUsage.error(message, "kick", "I could not find that user!");
  }

  if (
    target.hasPermission("ADMINISTRATOR" || "KICK_MEMBERS") ||
    target.roles.cache.has(modRoleID)
  ) {
    return message.channel.sendEmbed({
      color: "RED",
      title: "You cannot kick this user",
      description:
        "The user you are trying to kick cannot be kicked by the bot",
      timestamp: true,
    });
  }

  let canModKick;

  if (
    message.member.roles.cache.has(modRoleID) &&
    !message.member.hasPermission("KICK_MEMBERS")
  ) {
    canModKick = await canModeratorKick(message);
  }

  if (canModKick && !canModKick.canKick) {
    return message.channel.send(canModKick.finalTime);
  }

  let reason = args.slice(1).join(" ");

  let kickingMember;
  await message.channel
    .send("Kicking Member...")
    .then((msg) => updateAndDMUser(msg, message, target, reason))
    .catch((err) => console.log(err));

  if (canModKick) addCooldown(message);
};

async function canModeratorKick(message) {
  let moderator = message.author;
  let cooldownString = await db.get(`mod-cooldown.${message.guild.id}`);
  let cooldown = parseInt(cooldownString) || 15;
  let pad_zero = (num) => (num < 10 ? "0" : "") + num; //do not ask me what this does
  let timeObj;
  let lastKick = await db.get(`lastKick.${moderator.id}`);
  try {
    if (lastKick !== null && cooldown * 60000 - (Date.now() - lastKick) > 0) {
      timeObj = ms(cooldown * 60000 - (Date.now() - lastKick));
      let seconds = pad_zero(timeObj.seconds).padStart(2, ""),
        minutes = pad_zero(timeObj.minutes).padStart(2, "");
      let finalTime = `**You need to wait ${minutes} minutes(s) and ${seconds} second(s) to be able to kick again!**`;
      return { canKick: false, finalTime: finalTime };
    } else {
      return { canKick: true };
    }
  } catch (err) {
    console.log("Unexpected error in canModeratorKick()");
  }
}

function addCooldown(message) {
  console.log("cooldown");
  db.set(`lastKick.${message.author.id}`, Date.now());
}

async function updateAndDMUser(msg, message, target, reason) {
  try {
    await target.user.sendAction(message, reason, "kicked");
    await target.kick();
    await msg.delete();
    message.channel.sendEmbed({
      color: "GREEN",
      title: "Success!",
      description: `I successfully kicked ${
        target.user.username
      } from the server \n
    Reason: ${reason || "No Reason Provided"}
  `,
      timestamp: true,
    });
  } catch (error) {
    console.log();
  }
}
