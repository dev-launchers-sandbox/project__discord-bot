const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const CommandHandler = require("../../../../utils/CommandHandler.js");

exports.help = {
  name: "popreminder",
  description:
    "Pop the most recently added reminder from a user's reminder stack",
  usage: "popReminder",
  example: "popReminder"
};

exports.conf = {
  aliases: [],
  cooldown: 5
};

exports.run = async (client, message, args) => {
  let commandHandler = new CommandHandler(exports.help.name, message, args);
  if (commandHandler.validateCommand({})) {
    let channel = message.channel;
    let user = message.author;

    let reminderData = dbh.reminder.popUserReminder(user);

    if (reminderData)
      channel.sendEmbed({
        //author: user.id,
        title: "Reminder popped",
        description: reminderData.body
        //footer: channel
      });
    else
      channel.sendEmbed({
        title: "No reminder found on stack"
      });
  }
};
