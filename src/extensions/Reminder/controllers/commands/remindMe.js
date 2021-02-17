const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");
const chrono = require("chrono-node");

module.exports.help = {
  name: "remindme",
  description: "Schedule a reminder",
  usage: "remind <content>",
  example: "remind Work on my game next Saturday",
};

module.exports.conf = {
  aliases: ["promise", "ipromise", "i", "makepromise", "remind"],
  cooldown: 5,
};

module.exports.run = async (client, message, args) => {
  let commandHandler = new CommandHandler(module.exports.help.name, message, args);
  if (
    commandHandler.validateCommand({
      arguments: ["Content"],
    })
  ) {
    let channel = message.channel;
    let user = message.author;

    let reminderText = message.content;
    let reminderDate = chrono.parseDate(reminderText);
    let parsedObject = chrono.parse(reminderText);

    if (parsedObject[0]) {
      let timeString = parsedObject[0].text;
      let index = reminderText.indexOf(timeString);
      reminderText =
        reminderText.substring(0, index - 1) +
        reminderText.substring(index + timeString.length, reminderText.length);
    }

    dbh.reminder.addReminder({
      channel: channel,
      userId: user.id,
      body: reminderText,
      date: reminderDate,
      sentAt: Date.now(),
    });

    channel.sendEmbed({
      //author: user.id,
      color: 0xff9f01,
      title: "💾 Your reminder has been saved!",
      //description: reminderDate,
      //footer: channel
    });
  }
};
