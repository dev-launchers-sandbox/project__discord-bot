const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

const Reminder = require("../../structures/Reminder.js");
const TaskManager = require("../../../.common/structures/Tasks/TaskManager.js");

exports.eventHandle = "ready";
exports.event = async (client) => {
  metrics.sendEvent("ready");

  let taskManager = new TaskManager();

  const checkReminders = () => {
    let reminders = dbh.reminder.getReminders();
    if (!reminders) return;
    reminders.forEach((entry) => {
      let reminder = new Reminder(
        dbh,
        client,
        entry.channel,
        entry.userId,
        entry.body,
        entry.date,
        entry.sentAt
      );
      reminder.checkReminderDate();
    });
  };

  taskManager.addTask(checkReminders, 1000 * 60);
};
