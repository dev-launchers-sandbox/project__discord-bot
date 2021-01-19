module.exports = {
  name: "Reminder",
  helpCategory: "Reminders",
  commands: [
    require("./controllers/commands/remindMe.js"),
    require("./controllers/commands/popReminder.js"),
    require("./controllers/commands/getReminders.js"),
  ],
  events: [require("./controllers/events/reminderOnReady.js")],
  extends: [],
  structures: [],
  permissions: [],
};
