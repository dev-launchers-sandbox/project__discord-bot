const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

const commandUsage = require("./../../utils/commandUsage.js");
const getMessageTarget = require("./../../utils/getMessageTarget.js");
const directMessage = require("../../utils/directMessage.js");

exports.run = async (client, message, args) => {
  let modRoleID = await db.get(`moderator.${message.guild.id}`);
  if (!modRoleID) modRoleID = "notSet"; //Prevents error from happening on line 12

  if (
    !message.member.hasPermission("KICK_MEMBERS") &&
    !message.member.roles.cache.has(modRoleID)
  ) {
    return commandUsage.noPerms(message, "Kick Members");
  }

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(
      message,
      "kick",
      "Make sure you specified the user to kick!"
    );

  if (!target && !args[0]) {
    return commandUsage.missingParams(message, "Member to Kick", "kick");
  } else if (target === undefined && args[0]) {
    console.log(target);
    return commandUsage.error(message, "kick");
  }

  if (
    target.hasPermission("ADMINISTRATOR" || "KICK_MEMBERS") ||
    target.roles.cache.has(modRoleID)
  ) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("You cannot kick this user!")
      .setDescription(
        "The user you are trying to kick cannot be kicked by the bot"
      )
      .setTimestamp();
    return message.channel.send(embed);
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
  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Success!")
    .setDescription(
      `I successfully kicked ${target.user.username} from the server \n
      Reason: ${reason || "No Reason Provided"}
    `
    )
    .setTimestamp();
  try {
    await directMessage.sendPunishment(message, target, reason, "kicked");
    await target.kick();
    await msg.delete();
    message.channel.send(successEmbed);
  } catch (error) {
    console.log();
  }
}
exports.help = {
  name: "kick",
  description: "Kicks a member",
  usage: `kick <@user> [reason]`,
  example: `kick @Wumpus#0001 being rude`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
};
