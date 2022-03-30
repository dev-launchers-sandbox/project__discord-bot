const Discord = require("discord.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

const commandUsage = require("./../../../../utils/commandUsage.js");
const getMessageTarget = require("./../../../../utils/getMessageTarget.js");

exports.help = {
  name: "ban",
  description: "Ban a member from the server",
  usage: `ban <@user> [reason]`,
  example: `ban @Wumpus#0001 spamming`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"], //Moderator or higher.
  arguments: ["User To Ban"],
};

//If a member is not op, return automatically?
//If a member is not admin then we do the logging and the time req
//If the target has an op role or is not bannable return;
exports.run = async (client, message, args) => {
  const { member, guild, channel } = message;
  const opRoles = await dbh.guild.getOpRoles(message.guild.id);

  if (!opRoles.some((role) => member.roles.cache.has(role))) {
    commandUsage.noPerms(message, "MODERATOR");
    return;
  }

  const target = getMessageTarget.getMessageTarget(message, args);
  if (!target) {
    return commandUsage.error(message, "ban", "I could not find that user!");
  }
  if (opRoles.some((role) => target.roles.cache.has(role)) || !target.bannable) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: "I cannot ban this member!",
    });
  }

  const hasBanPerms = member.hasPermission("BAN_MEMBERS");
  if (!hasBanPerms) {
    //TODO: Check if the moderator can kick (cooldown)
  }

  const reason = args.slice(1).join(" ") || "No reason provided.";

  //If the user has turned DMs off, this will fail.
  try {
    await target.user.sendAction(message.guild.name, reason, "banned");
  } catch (e) {}

  await target.ban({
    reason: `Banned By: ${member.user.username}#${member.user.discriminator}  Reason: ${reason}`,
  });
  channel.sendEmbed({
    color: 0xff9f01,
    description: `Successfully banned ${target.user.username}#${target.user.discriminator}\nReason: ${reason}`,
  });
};
