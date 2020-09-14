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
      "unmute",
      "Make sure you specified the user to unmute."
    );

  function noMuteEmbed(description) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("You cannot unmute this user", target.user.displayAvatarURL())
      .setDescription(description)
      .setTimestamp();
    return message.channel.send(embed);
  }

  if (!message.member.hasPermission("MANAGE_ROLES")) {
    return commandUsage.noPerms(message, "Manage Roles");
  }

  if (!target.roles.cache.find((r) => r.name === "Muted")) {
    return noMuteEmbed("This user is not muted!");
  }
  let reason = args.slice(1).join(" ");

  let mutedRole = message.guild.roles.cache.find((r) => r.name === "Muted");
  target.roles.remove(mutedRole);

  punishments.sendMessage(message, target, reason, "unmuted");

  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(
      `${target.user.username} has been unmuted!`,
      target.user.displayAvatarURL()
    )
    .setDescription(
      `**${target.user.username}** has been unmuted by **${message.author.username}**`
    )
    .setTimestamp();
  message.channel.send(successEmbed);
};

exports.help = {
  name: "unmute",
  description: "Unmuted a user",
  usage: "unmute <@user>",
  example: "unmute @Wumpus#0001",
};

exports.conf = {
  aliases: ["tr", "teams"],
  cooldown: 5,
};
