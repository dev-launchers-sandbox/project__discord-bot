const quickDB = require("quick.db");

class DatabaseHandler {
  constructor() {
    this.bean = new BeanHandler();
    this.reminder = new ReminderHandler();
  }
}

class BeanHandler {
  constructor() {}

  getUserDevBeans(userId) {
    return quickDB.get(`account.${target.user.id}.devBeans`);
  }

  getUserGoldenBeans(userId) {
    return quickDB.get(`account.${target.user.id}.goldenBeans`);
  }

  getUserForeverDevBeans(userId) {
    return quickDB.get(`account.${target.user.id}.foreverDevBeans`);
  }

  getUserForeverGoldenBeans(userId) {
    return quickDB.get(`account.${target.user.id}.foreverGoldenBeans`);
  }
}

class ReminderHandler {
  constructor() {}

  getReminders() {
    return quickDB.get(`reminders`);
  }

  addReminder(reminder) {
    quickDB.push(`reminders`, reminder);
  }

  removeReminder(reminder) {
    let reminders = this.getReminders();
    let filtered = reminders.filter((entry) => {
      return entry.id != reminder.id;
    });
    this.setReminders(filtered);
  }

  setReminders(reminders) {
    quickDB.set(`reminders`, reminders);
  }

  clearReminders() {
    quickDB.set(`reminders`, []);
  }
}

module.exports = new DatabaseHandler();
