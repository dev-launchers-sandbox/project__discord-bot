const quickDB = require("quick.db");

class DatabaseHandler {
  constructor() {
    this.bean = new BeanHandler();
    this.reminder = new ReminderHandler();
    this.invite = new InviteHandler();
    this.thread = new ThreadHandler();
    this.currency = new CurrencyHandler();
    this.newUserRoles = new NewUserRolesHandler();
  }
}

class BeanHandler {
  constructor() {}

  getUserDevBeans(userId) {
    return quickDB.get(`account.${userId}.devBeansTwo`) || 0;
  }

  getUserGoldenBeans(userId) {
    return quickDB.get(`account.${userId}.goldenBeansTwo`) || 0;
  }

  getUserForeverDevBeans(userId) {
    return quickDB.get(`account.${userId}.foreverDevBeans`) || 0;
  }

  getUserForeverGoldenBeans(userId) {
    return quickDB.get(`account.${userId}.foreverGoldenBeans`) || 0;
  }

  getDevBeanEmojiId(guildId) {
    return quickDB.get(`dev-bean-emoji.${guildId}`);
  }

  getGoldenBeanEmojiId(guildId) {
    return quickDB.get(`golden-bean-emoji.${guildId}`);
  }

  getLastDevBeanGiven(userId) {
    return quickDB.get(`lastDevBean.${userId}`);
  }
  getLastGoldenBeanGiven(userId) {
    return quickDB.get(`lastGoldenBean.${userId}`);
  }

  setLastDevBeanGiven(userId, date) {
    quickDB.set(`lastDevBean.${userId}`, date);
  }

  setLastGoldenBean(userId, date) {
    quickDB.set(`lastGoldenBean.${userId}`, date);
  }

  addDevBean(userId, amount = 1) {
    quickDB.add(`account.${userId}.devBeansTwo`, amount);
    quickDB.add(`account.${userId}.foreverDevBeans`, amount);
  }

  addGoldenBean(userId, amount = 1) {
    quickDB.add(`account.${userId}.goldenBeansTwo`, amount);
    quickDB.add(`account.${userId}.foreverGoldenBeans`, amount);
  }

  getDevBeanedMessages(userId) {
    let devBeanedMessages = quickDB.get(`${userId}.devBeanedMessages`);
    return devBeanedMessages || [];
  }

  getGoldenBeanedMessages(userId) {
    let goldenBeanedMessages = quickDB.get(`${userId}.goldenBeanedMessages`);
    return goldenBeanedMessages || [];
  }

  async addDevBeanedMessage(userId, messageId) {
    if (!this.getDevBeanedMessages()) await quickDB.set(`${userId}.devBeanedMessages`, []);
    quickDB.push(`${userId}.devBeanedMessages`, messageId);
  }

  async addGoldenBeanedMessage(userId, messageId) {
    if (!this.getGoldenBeanedMessages()) await quickDB.set(`${userId}.goldenBeanedMessages`, []);
    quickDB.push(`${userId}.goldenBeanedMessages`, messageId);
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
      return !(entry.sentAt === reminder._sentAt && entry.userId === reminder._userId);
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
    let threads = this.getThreads(guildId);

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
    let index = threads.findIndex((t) => t.id === updatedThread.id);
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
    let updatedThreads = threads.filter((thread) => thread.id !== threadId);
    this.setThreads(updatedThreads);
  }

  getModerationServer(guildId) {
    return quickDB.get(`moderation-server.${guildId}`);
  }
}
class CurrencyHandler {
  constructor() {}

  addCoins(user, amount) {
    quickDB.add(`account.${user}.coins`, amount);
  }

  removeCoins(user, amount) {
    quickDB.remove(`account.${user}.coins`, amount);
  }

  getCoins(user) {
    return quickDB.get(`account.${user}.coins`);
  }
}

class NewUserRolesHandler {
  constructor() {}

  getRoles(guildId) {
    return quickDB.get(`${guildId}.newUserRoles`);
  }

  addRole(guildId, roleId) {
    let roles = this.getRoles(guildId) || [];
    if (roles.indexOf(roleId) > -1) return false; //If the role is already in the array, return.
    quickDB.push(`${guildId}.newUserRoles`, roleId);
    return true;
  }

  removeRole(guildId, roleId) {
    let roles = this.getRoles(guildId) || [];
    let indexToRemove = roles.indexOf(roleId);
    if (indexToRemove === -1) return false; //If the role is not in the array, return.
    roles.splice(indexToRemove, 1); //Remove the role from the array.
    quickDB.set(`${guildId}.newUserRoles`, roles);
    return true;
  }
}
module.exports = new DatabaseHandler();
