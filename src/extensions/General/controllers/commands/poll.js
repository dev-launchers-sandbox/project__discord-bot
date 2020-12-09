const Discord = require("discord.js");
const CommandHandler = require("../../../../utils/CommandHandler.js");

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

exports.run = async (client, message, args) => {
  let commandHandler = new CommandHandler(exports.help.name, message, args);
  if (
    commandHandler.validateCommand({
      permissions: ["MANAGE_MESSAGES"],
      arguments: ["Poll Content"],
    })
  ) {
    let channel = message.channel;
    let user = message.author;
    channel.sendPoll({
      subject: args.slice(0).join(" "),
      author: user.username,
    });

    commandHandler.deleteCommand();
  }
};
