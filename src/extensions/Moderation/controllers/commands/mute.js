const Discord = require("discord.js");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");
const directMessage = require("../../../../utils/directMessage.js");

exports.help = {
  name: "mute",
  description: "Mutes a user",
  usage: "mute <@user> [reason]",
  example: "mute @Wumpus#0001 being too cool",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["MANAGE_ROLES"],
  arguments: ["User To Mute"],
};

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES")) {
    return commandUsage.noPerms(message, "Manage Roles");
  }
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(message, "mute", "I could not find that user!");

  function noMuteEmbed(description) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("You cannot mute this user", target.user.displayAvatarURL())
      .setDescription(description)
      .setTimestamp();
    return message.channel.send(embed);
  }
  if (target.hasPermission("MANAGE_ROLES")) {
    return noMuteEmbed("This user has the manage_roles permission!");
  }

  if (!message.guild.roles.cache.find((r) => r.name === "Muted")) {
    return noMuteEmbed("I cannot find the muted role!");
  }

  if (target.roles.cache.find((r) => r.name === "Muted")) {
    return noMuteEmbed("This user is already muted!");
  }
  let reason = args.slice(1).join(" ");
  if (!reason) reason = "Not Provided";
  let mutedRole = message.guild.roles.cache.find((r) => r.name === "Muted");
  target.roles.add(mutedRole);

  directMessage.sendPunishment(message.guild.name, target, reason, "muted");

  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(
      `${target.user.username} has been muted!`,
      target.user.displayAvatarURL()
    )
    .setDescription(`Reason: ${reason}`)
    .setTimestamp();
  message.channel.send(successEmbed);
};
