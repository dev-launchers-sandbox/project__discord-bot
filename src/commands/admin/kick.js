const Discord = require("discord.js");
const commandUsage = require("./../../utils/commandUsage.js");
const getMessageTarget = require("./../../utils/getMessageTarget.js");
const punishments = require("../../utils/punishments.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return commandUsage.noPerms(message, "Kick Members");
  }
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target)
    return commandUsage.error(
      message,
      "kick",
      "Make sure you specified the user to kick!"
    );

  if (!target && !args[0]) {
    return commandUsage.missingParams(message, "Member to Kick", "kick");
  } else if (target === undefined && args[0]) {
    console.log(target);
    return commandUsage.error(message, "kick");
  }

  if (target.hasPermission("ADMINISTRATOR" || "KICK_MEMBERS")) {
    let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("You cannot kick this user!")
      .setDescription(
        "The user you are trying to kick cannot be kicked by the bot"
      )
      .setTimestamp();
    return message.channel.send(embed);
  }
  let reason = args.slice(1).join(" ");

  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Success!")
    .setDescription(
      `I successfully kicked ${target.user.username} from the server \n
      Reason: ${reason || "No Reason Provided"}
    `
    )
    .setTimestamp();
  let kickingMember;
  message.channel
    .send("Kicking Member...")
    .then((msg) => updateAndDMUser(msg))

    .catch((err) => console.log(err));

  const updateAndDMUser = async (msg) => {
    try {
      await punishments.sendMessage(message, target, reason, "kicked");
      await target.kick();
      await msg.delete();
      message.channel.send(successEmbed);
    } catch (error) {
      console.log("Error in kick");
    }
  };
};

exports.help = {
  name: "kick",
  description: "Kicks a member",
  usage: `kick <@user> [reason]`,
  example: `kick @Wumpus#0001 being rude`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
};
