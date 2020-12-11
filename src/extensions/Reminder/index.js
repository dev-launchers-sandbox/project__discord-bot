module.exports = {
  name: "Reminder",
  helpCategory: "Reminders",
  commands: [
    require("./controllers/commands/remind.js"),
    require("./controllers/commands/getReminders.js"),
  ],
  events: [require("./controllers/events/reminderOnReady.js")],
  extends: [],
  structures: [],
};
