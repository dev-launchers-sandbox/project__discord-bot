const Discord = require("discord.js");
const commandUsage = require("./../../utils/commandUsage.js");
const getMessageTarget = require("./../../utils/getMessageTarget.js");
const punishments = require("../../utils/punishments.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    return commandUsage.noPerms(message, "Ban Members");
  }
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(
      message,
      "ban",
      "Make sure you specified the user to ban!"
    );

  if (!target && !args[0]) {
    return commandUsage.missingParams(message, "Member to Ban", "ban");
  } else if (target === undefined && args[0]) {
    return commandUsage.error(message, "ban");
  }

  if (target.hasPermission("ADMINISTRATOR" || "BAN_MEMBERS")) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("You cannot ban this user!")
      .setDescription(
        "The user you are trying to ban cannot be banned by the bot"
      )
      .setTimestamp();
    return message.channel.send(embed);
  }
  let reason = args.slice(1).join(" ");
  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Success!")
    .setDescription(
      `I successfully banned ${target.user.username} from the server \n
      Reason: ${reason || "No Reason Provided"}
    `
    )
    .setTimestamp();
  message.channel
    .send("Banning Member...")
    .then((msg) => updateAndDMUser(msg))
    .catch((err) => console.log(err));

  const updateAndDMUser = async (msg) => {
    try {
      await punishments.sendMessage(message, target, reason, "banned");
      await target.ban({
        reason: `Banned By: ${message.author.username}  Reason: ${
          reason || "No reason provided"
        }`,
      });
      await msg.delete();
      message.channel.send(successEmbed);
    } catch (error) {
      console.log("Error in ban");
    }
  };
};

exports.help = {
  name: "ban",
  description: "Ban a member from the server",
  usage: `ban <@member> [reason]`,
  example: `ban @discord#0000 spamming`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
};
