const Discord = require("discord.js");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "mute",
  description: "Mutes a user",
  usage: "mute <@user> [reason]",
  example: "mute @Wumpus#0001 being too cool",
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To Mute"],
};

module.exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) {
    return commandUsage.error(message, "mute", "I could not find that user!");
  }

  if (target.hasPermission("MANAGE_ROLES")) {
    sendCannotMuteEmbed(
      message.channel,
      "This user has the manage_roles permission!",
      target.user.displayAvatarURL()
    );
    return;
  }

  if (!message.guild.roles.cache.find((r) => r.name === "Muted")) {
    sendCannotMuteEmbed(
      message.channel,
      "I cannot find the muted role!",
      target.user.displayAvatarURL()
    );
    return;
  }

  if (target.roles.cache.find((r) => r.name === "Muted")) {
    sendCannotMuteEmbed(
      message.channel,
      "This user is already muted!",
      target.user.displayAvatarURL()
    );
    return;
  }

  let reason = args.slice(1).join(" ") || "Not Provided";

  let mutedRole = message.guild.roles.cache.find((r) => r.name === "Muted");
  target.roles.add(mutedRole);

  target.user.sendAction(message.guild.name, reason, "muted");

  sendSuccessEmbed(message.channel, reason, target.user);
};

function sendCannotMuteEmbed(channel, description, avatar) {
  channel.sendEmbed({
    color: "RED",
    author: {
      name: "You cannot mute this user",
      image: avatar,
    },
    description: description,
    timestamp: true,
  });
}

function sendSuccessEmbed(channel, reason, user) {
  channel.sendEmbed({
    color: "GREEN",
    author: {
      name: `${user.username} has been muted!`,
      image: user.displayAvatarURL(),
    },
    description: `Reason: ${reason}`,
    timestamp: true,
  });
}
