const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

const commandUsage = require("./../../../../utils/commandUsage.js");
const getMessageTarget = require("./../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "ban",
  description: "Ban a member from the server",
  usage: `ban <@user> [reason]`,
  example: `ban @Wumpus#0001 spamming`,
};
module.exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"], //Moderator or higher.
  arguments: ["User To Ban"],
};

module.exports.run = async (client, message, args) => {
  let modRoleID = await db.get(`moderator.${message.guild.id}`);
  if (!modRoleID) modRoleID = "notSet"; //Prevents error from happening on line 12

  let target = getMessageTarget.getMessageTarget(message, args);

  if (!target) {
    return commandUsage.error(message, "ban", "I could not find that user!");
  }

  if (
    target.hasPermission("ADMINISTRATOR" || "BAN_MEMBERS") ||
    target.roles.cache.has(modRoleID)
  ) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("You cannot ban this user!")
      .setDescription(
        "The user you are trying to ban cannot be banned by the bot"
      )
      .setTimestamp();
    return message.channel.send(embed);
  }

  let canModBan;

  if (
    message.member.roles.cache.has(modRoleID) &&
    !message.member.hasPermission("BAN_MEMBERS")
  ) {
    canModBan = await canModeratorBan(message);
  }

  if (canModBan && !canModBan.canBan) {
    return message.channel.send(canModBan.finalTime);
  }

  let reason = args.slice(1).join(" ");

  message.channel
    .send("Banning Member...")
    .then((msg) => updateAndDMUser(msg))
    .catch((err) => console.log(err));

  if (canModBan) await addCooldown(message);

  const updateAndDMUser = async (msg) => {
    try {
      await target.user.sendAction(message.guild.name, reason, "banned");
      await target.ban({
        reason: `Banned By: ${message.author.username}  Reason: ${
          reason || "No reason provided"
        }`,
      });
      await msg.delete();

      message.channel.sendEmbed({
        color: "GREEN",
        title: "Success!",
        description: `I successfully banned ${
          target.user.username
        } from the server \n
      Reason: ${reason || "No Reason Provided"}
    `,
        timestamp: true,
      });
    } catch (error) {
      console.log("Error in ban");
    }
  };
};

async function canModeratorBan(message) {
  let moderator = message.author;
  let cooldownString = await db.get(`mod-cooldown.${message.guild.id}`);
  let cooldown = parseInt(cooldownString) || 15;
  let pad_zero = (num) => (num < 10 ? "0" : "") + num; //do not ask me what this does
  let timeObj;
  let lastBan = await db.get(`lastBan.${moderator.id}`);
  try {
    if (lastBan !== null && cooldown * 60000 - (Date.now() - lastBan) > 0) {
      timeObj = ms(cooldown * 60000 - (Date.now() - lastBan));
      let seconds = pad_zero(timeObj.seconds).padStart(2, ""),
        minutes = pad_zero(timeObj.minutes).padStart(2, "");
      let finalTime = `**You need to wait ${minutes} minutes(s) and ${seconds} second(s) to be able to ban again!**`;
      return { canBan: false, finalTime: finalTime };
    } else {
      return { canBan: true };
    }
  } catch (err) {
    console.log(err);
    console.log("Unexpected error in canModeratorBan()");
  }
}

async function addCooldown(message) {
  await db.set(`lastBan.${message.author.id}`, Date.now());
}
