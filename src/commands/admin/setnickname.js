const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
    return message.channel.send({
      embed: { color: "RED", description: "You cannot use this command!" },
    });
  }

  let user = message.mentions.users.first();
  if (!user)
    return message.channel.send({
      embed: { color: "RED", description: "You need to mention the user" },
    });
  let nick = args.slice(1).join(" ");
  if (!nick)
    return message.channel.send({
      embed: { color: "RED", description: "You need to provide a nickname" },
    });

  let member = message.guild.members.cache.get(user.id);
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
      description: `Successfully changed **${user.tag}**’s nickname to **${nick}**`,
    },
  });
};

exports.help = {
  name: "setnickname",
  description: "Set a user’s nickname",
  usage: "setnickname <@user> <nickname>",
  example: "setNickname @Pango#0000 modbot",
};

exports.conf = {
  aliases: ["nickname", "nick", "setnick"],
  cooldown: 5,
};
