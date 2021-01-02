const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

exports.help = {
  name: "removewarn",
  description: "Removes a warning from a user",
  usage: "removewarn <@user> <#of warn>",
  example: "removewarn @Wumpus#0001 2",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["User", "#Of Warn"],
};

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) return commandUsage.error(message, "mute", "User not found!.");

  let userWarns = await db.get(
    `warnings.${message.guild.id}.${target.user.id}`
  );

  let index = parseInt(args[1], 10) - 1;
  let warnObj = userWarns[index];

  if (!warnObj) {
    sendWarningNotFoundEmbed(message.channel, args);
    return;
  }

  userWarns.splice(index, 1);

  try {
    await db.set(`warnings.${message.guild.id}.${target.user.id}`, userWarns);
    sendSuccessEmbed(message.channel, args, target.user.displayAvatarURL());
  } catch (error) {
    console.error(error);
  }
};

function sendSuccessEmbed(channel, args, avatar) {
  channel.sendEmbed({
    color: "GREEN",
    author: {
      name: `Warning #${args[1]} has been removed`,
      image: avatar,
    },
    timestamp: true,
  });
}

function sendWarningNotFoundEmbed(channel, args) {
  channel.sendEmbed({
    color: "RED",
    title: `Warning #${args[1]} not found!`,
    description: `Make sure the user has at least ${args[1]} warnings!`,
    timestamp: true,
  });
}
