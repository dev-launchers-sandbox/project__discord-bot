const Discord = require("discord.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

const commandUsage = require("./../../../../utils/commandUsage.js");
const getMessageTarget = require("./../../../../utils/getMessageTarget.js");

exports.help = {
  name: "kick",
  description: "Kicks a member",
  usage: `kick <@user> [reason]`,
  example: `kick @Wumpus#0001 being rude`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To Kick"],
};

exports.run = async (client, message, args) => {
  const { member, guild, channel } = message;
  const opRoles = await dbh.guild.getOpRoles(message.guild.id);

  if (!opRoles.some((role) => member.roles.cache.has(role))) {
    commandUsage.noPerms(message, "MODERATOR");
    return;
  }

  const target = getMessageTarget.getMessageTarget(message, args);
  if (!target) {
    return commandUsage.error(message, "kick", "I could not find that user!");
  }
  if (opRoles.some((role) => target.roles.cache.has(role)) || !target.kickable) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: "I cannot kick this member!",
    });
  }

  const hasKickPerms = member.hasPermission("KICK_MEMBERS");
  if (!hasKickPerms) {
    //TODO: Check if the moderator can kick (cooldown)
  }

  const reason = args.slice(1).join(" ") || "No reason provided.";

  //If the user has turned DMs off, this will fail.
  try {
    await target.user.sendAction(message.guild.name, reason, "kicked");
  } catch (e) {}

  await target.kick({
    reason: `Kicked By: ${member.user.username}#${member.user.discriminator}  Reason: ${reason}`,
  });
  channel.sendEmbed({
    color: 0xff9f01,
    description: `Successfully kicked ${target.user.username}#${target.user.discriminator}\nReason: ${reason}`,
  });
};
