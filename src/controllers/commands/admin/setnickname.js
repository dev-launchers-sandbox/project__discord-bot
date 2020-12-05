const Discord = require("discord.js");
const commandUsage = require("../../../utils/commandUsage.js");
const getMessageTarget = require("../../../utils/getMessageTarget.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
    return commandUsage.noPerms(message, "Manage Nicknames");
  }

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return message.channel.send({
      embed: { color: "RED", description: "You need to mention the user" },
    });

  let nick = args.slice(1).join(" ");
  if (!nick)
    return message.channel.send({
      embed: { color: "RED", description: "You need to provide a nickname" },
    });

  let member = message.guild.members.cache.get(target.id);
  if (member.hasPermission("ADMINISTRATOR") && member.user !== client.user) {
    return message.channel.send({
      embed: {
        color: "RED",
        description: "I cannot change admininstrator’s nicknames!",
      },
    });
  }
  await member.setNickname(nick);
  return message.channel.send({
    embed: {
      color: "GREEN",
      description: `Successfully changed **${target.user.tag}**’s nickname to **${nick}**`,
    },
  });
};

exports.help = {
  name: "setnickname",
  description: "Set a user’s nickname",
  usage: "setnickname <@user> <nickname>",
  example: "setnickname @Wumpus#0001 Wompas",
};

exports.conf = {
  aliases: ["nickname", "nick", "setnick"],
  cooldown: 5,
};
