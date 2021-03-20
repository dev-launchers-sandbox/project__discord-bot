const quickDB = require("quick.db");

class DatabaseHandler {
  constructor() {
    this.bean = new BeanHandler();
    this.reminder = new ReminderHandler();
    this.invite = new InviteHandler();
    this.thread = new ThreadHandler();
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
      return !(
        entry.sentAt === reminder._sentAt && entry.userId === reminder._userId
      );
    });
    this.setReminders(filtered);
  }

  setReminders(reminders) {
    quickDB.set(`reminders`, reminders);
    return reminders;
  }

  getUserReminders(user) {
    return quickDB.get(`reminders`).filter((entry) => {
      return entry.userId == user.id;
    });
  }

  popUserReminder(user) {
    // Using global stack to emulate individual user stacks
    let reminders = this.getReminders();
    let reminder;
    for (let i = reminders.length - 1; i >= 0; i--) {
      if (user.id == reminders[i].userId) {
        console.log("FOUND REMINDER");
        reminder = reminders.splice(i, 1)[0];
        break;
      }
    }
    this.setReminders(reminders);
    return reminder;
  }

  clearReminders() {
    quickDB.set(`reminders`, []);
  }
}

class InviteHandler {
  constructor() {}

  setInvite(guildId, name, code) {
    quickDB.set(`invites.${guildId}.${name}`, code);
  }

  getInvites(guildId) {
    return quickDB.get(`invites.${guildId}`);
  }

  getInvite(guildId, name) {
    return quickDB.get(`invites.${guildId}.${name}`);
  }

  removeInvite(guildId, name) {
    quickDB.delete(`invites.${guildId}.${name}`);
  }

  getInviteChannel(guildId) {
    return quickDB.get(`invite.${guildId}`);
  }
}

class ThreadHandler {
  constructor() {}

  getThreadCategory(guildId) {
    return quickDB.get(`threads-category.${guildId}`);
  }

  async addThread(guildId, thread) {
    let threads = this.getThreads(guildId)

    //Makes sure that the entry has been created to avoid error on the push.
    if (!Array.isArray(threads)) await this.setThreads([]);

    quickDB.push("threads", thread);
  }

  getDirectoryChannelId(guildId) {
    return quickDB.get(`directory-channel.${guildId}`);
  }

  async setThreads(threads) {
    await quickDB.set("threads", threads);
  }

  getThreads(guildId) {
    return quickDB.get("threads");
  }

  updateThread(threadId, updatedThread) {
    let threads = this.getThreads(updatedThread.guildId);
    let index = threads.findIndex(t => t.id === updatedThread.id);
    if (index !== -1) {
      threads.splice(index, 1, updatedThread);
      this.setThreads(threads);
    }
  }

  getMaxInactivityTime(guildId) {
    return quickDB.get(`thread-inactivity-time.${guildId}`);
  }

  removeThread(threadId) {
    let threads = this.getThreads();
    let updatedThreads = threads.filter(thread => thread.id !== threadId);
    this.setThreads(updatedThreads);
  }

  getModerationServer(guildId) {
    return quickDB.get(`moderation-server.${guildId}`);
  }
}
module.exports = new DatabaseHandler();
