const Discord = require("discord.js");
const commandUsage = require("../../utils/commandUsage.js");

exports.run = async (client, message, args) => {
  //Checks if the user who ran the command has the permissions to manage members.
  // This prevents users having control over things their discords permissions don’t allow them to do.
  if (!message.member.permissions.has("MANAGE_MESSAGES")) {
    return commandUsage.noPerms(message, "Manage Messages");
  }
  if (!args[0]) {
    commandUsage.missingParams(message, "Poll Content", "poll");
    return;
  }
  message.delete();
  let messageArgs = args.slice(0).join(" ");
  const pollEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle("📝 " + "**" + messageArgs + "**")
    .setDescription("Poll initated by " + message.author.username);
  message.channel.send(pollEmbed).then((msgReaction) => {
    msgReaction.react("👍");
    msgReaction.react("👎");
  });
};

exports.help = {
  name: "poll",
  description: "Create a simple poll",
  usage: "poll <content>",
  example: "poll Is this helpful?",
};

exports.conf = {
  aliases: ["p"],
  cooldown: 5,
};
