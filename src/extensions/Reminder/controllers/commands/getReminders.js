const Discord = require("discord.js");
const CommandHandler = require("../../../../utils/CommandHandler.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "getreminders",
  description: "Get all accountability reminders",
  usage: "getreminders",
  example: "getreminders"
};

exports.conf = {
  aliases: [],
  cooldown: 5
};

exports.run = async (client, message, args) => {
  console.log("entered");
  let channel = message.channel;
  let user = message.author;

  const reminderEntries = dbh.reminder.getUserReminders(user);
  if (reminderEntries.length) {
    channel.send("Fetching entries...");
    for (let i = 0; i < reminderEntries.length; i++) {
      const entry = reminderEntries[i];
      channel.sendEmbed({
        title: entry.body
      });
    }
  } else
    channel.sendEmbed({
      title: "No reminders found"
    });
};
