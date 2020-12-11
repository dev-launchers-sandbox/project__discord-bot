const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DatabaseHandler.js");
const CommandHandler = require("../../../../utils/CommandHandler.js");
const chrono = require("chrono-node");

exports.help = {
  name: "remind",
  description: "Schedule a reminder",
  usage: "remind <content>",
  example: "remind Work on my game next Saturday",
};

exports.conf = {
  aliases: ["promise", "makepromise", "remindme"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let commandHandler = new CommandHandler(exports.help.name, message, args);
  if (
    commandHandler.validateCommand({
      arguments: ["Content"],
    })
  ) {
    let channel = message.channel;
    let user = message.author;

    let reminderText = args.slice(0).join(" ");
    let reminderDate = chrono.parseDate(reminderText);

    dbh.reminder.addReminder({
      channel: channel,
      userId: user.id,
      body: reminderText,
      date: reminderDate,
    });

    channel.sendEmbed({
      author: user.id,
      title: reminderText,
      description: reminderDate,
      footer: channel,
    });
  }
};
