const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DatabaseHandler.js");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

require();

exports.eventHandle = "ready";
exports.event = async (client) => {
  metrics.sendEvent("ready");
  console.log("reminder ready");

  let taskManager = new TaskManager();

  const checkReminders = () => {
    let reminders = dbh.reminder.getReminders();
    reminders.forEach((entry) => {
      let reminder = new Reminder(
        client,
        entry.channel,
        entry.userId,
        entry.body,
        entry.date
      );
      reminder.checkReminderDate();
    });
  };

  taskManager.addTask(checkReminders, 1000 * 60);
};
