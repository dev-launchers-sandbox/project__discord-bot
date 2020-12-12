const Discord = require("discord.js");
const CommandHandler = require("./../../../../extensions/.common/CommandHandler/CommandHandler.js");

exports.help = {
  name: "poll",
  description: "Create a simple poll",
  usage: "poll <content>",
  example: "poll Is this helpful?",
};

exports.conf = {
  aliases: ["p"],
  cooldown: 5,
  arguments: ["Poll Content"],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let user = message.author;
  channel.sendPoll({
    subject: args.slice(0).join(" "),
    author: user.username,
  });

  let commandHandler = new CommandHandler(exports.help.name, message, args);
  commandHandler.deleteCommand();
};
