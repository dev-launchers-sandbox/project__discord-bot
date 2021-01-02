const Discord = require("discord.js");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

exports.help = {
  name: "setnickname",
  description: "Set a user’s nickname",
  usage: "setnickname <@user> <nickname>",
  example: "setnickname @Wumpus#0001 Wompas",
};

exports.conf = {
  aliases: ["nickname", "nick", "setnick"],
  cooldown: 5,
  permissions: ["MANAGE_NICKNAMES"],
  arguments: ["User", "New Nickname"],
};

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return message.channel.sendEmbed({
      color: "RED",
      description: "User not found",
    });

  let nick = args.slice(1).join(" ");

  let member = message.guild.members.resolve(target.id);

  if (member.hasPermission("ADMINISTRATOR") && member.user !== client.user) {
    return message.channel.sendEmbed({
      color: "RED",
      description: "I cannot change admininstrator’s nicknames!",
    });
  }
  await member.setNickname(nick);
  return message.channel.sendEmbed({
    color: "GREEN",
    description: `Successfully changed **${target.user.tag}**’s nickname to **${nick}**`,
  });
};
