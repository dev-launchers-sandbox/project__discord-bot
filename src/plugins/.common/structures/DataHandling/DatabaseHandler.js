const quickDB = require("quick.db");
const { Guild, Channel } = require("./../../../../../api/models/index.js");

class DatabaseHandler {
  constructor() {
    this.guild = new GuildHandler();
    this.invite = new InviteHandler();
    this.channels = new ChannelsHandler();
    this.bean = new BeanHandler();
    this.reminder = new ReminderHandler();
    this.thread = new ThreadHandler();
    this.currency = new CurrencyHandler();
  }
}

class GuildHandler {
  constructor() {}

  async createGuild(guildId) {
    console.log(`Creating guild with id: ${guildId}`);
    if (this.getGuild(guildId, false) !== null) return false;
    return await Guild.create(
      { discordId: guildId },
      {
        include: Guild.Channel,
      }
    );
  }

  async deleteGuild(guildId) {
    console.log(`Deleting guild with id: ${guildId}`);
    const guild = await this.getGuild(guildId, false);
    if (!guild) return;
    console.log(`Destroying guild with id: ${guildId}`);
    guild.destroy();
  }

  async getGuild(guildId, createIfNotExist = true) {
    if (createIfNotExist) {
      const [guild, wasCreated] = await Guild.findOrCreate({
        where: { discordId: guildId },
        include: Guild.Channel,
      });
      return guild;
    }
    console.log(`Getting guild with id: ${guildId}`);
    return await Guild.findOne({ where: { discordId: guildId } });
  }

  //DO NOT USE THIS METHOD UNLESS NECESSARY. Use the specific field methods below!
  async getField(guildId, field, createIfNotExist = true) {
    const guild = await this.getGuild(guildId, createIfNotExist);
    if (!guild) return;
    return guild.get(field);
  }

  //Guild ID is the discord string, getId returns the custom generated integer id.
  async getId(guildId, createIfNotExist = true) {
    return this.getField(guildId, "id", createIfNotExist);
  }
  async getPrefix(guildId, createIfNotExist = true) {
    return this.getField(guildId, "prefix", createIfNotExist);
  }

  async getOpRoles(guildId, createIfNotExist = true) {
    return this.getField(guildId, "opRoles", createIfNotExist);
  }

  async getDefaultMemberRoles(guildId, createIfNotExist = true) {
    return this.getField(guildId, "defaultMemberRoles", createIfNotExist);
  }

  async getLevels(guildId, createIfNotExist = true) {
    return this.getField(guildId, "levels", createIfNotExist);
  }

  async getInvites(guildId, createIfNotExist = true) {
    return this.getField(guildId, "invites", createIfNotExist);
  }

  async getThreadInactivityTime(guildId, createIfNotExist = true) {
    return this.getField(guildId, "threadInactivityTime", createIfNotExist);
  }

  async getModerationServer(guildId, createIfNotExist = true) {
    return this.getField(guildId, "moderationServer", createIfNotExist);
  }

  async getModCooldown(guildId, createIfNotExist = true) {
    return this.getField(guildId, "modCooldown", createIfNotExist);
  }

  async getMinecraftRole(guildId, createIfNotExist = true) {
    return this.getField(guildId, "minecraftRole", createIfNotExist);
  }
  //DO NOT USE THIS METHOD UNLESS NECESSARY. Use the specific field methods below!
  async setField(guildId, field, newValue, createIfNotExist = true) {
    const guild = await this.getGuild(guildId, createIfNotExist);
    guild[field] = newValue;
    guild.save();
  }

  async setLevels(guildId, newValue, createIfNotExist = true) {
    this.setField(guildId, "levels", newValue, createIfNotExist);
  }

  async setDefaultMemberRoles(guildId, newValue, createIfNotExist = true) {
    this.setField(guildId, "defaultMemberRoles", newValue, createIfNotExist);
  }
}

class InviteHandler {
  constructor() {
    this._guild = new GuildHandler();
  }
  async getInvites(guildId, createIfNotExist = true) {
    const guild = this._guild.getGuild(guildId, createIfNotExist);
    if (!guild) return null;
    else return guild.get("invites");
  }

  async getInviteByCode(guildId, code, createIfNotExist = true) {
    return (await this.getInvites(guildId, createIfNotExist)).find((invite) => invite.code === code);
  }

  async getInviteByName(guildId, name, createIfNotExist = true) {
    return (await this.getInvites(guildId, createIfNotExist)).find((invite) => invite.name === name);
  }

  async addInvite(guildId, name, code, createIfNotExist = true) {
    const invites = await this.getInvites(guildId, createIfNotExist);
    //If an invite with the same name/code exists, don't change anything and return false.
    if (invites.some((invite) => invite.name === name || invite.code === code)) return false;
    invites.push({ name: name, code: code });
    this._setInvites(guildId, invites);
    return true;
  }

  async removeInviteByName(guildId, name, createIfNotExist = true) {
    const invites = await this.getInvites(guildId, createIfNotExist);
    const invite = await this.getInviteByName(guildId, name, createIfNotExist);
    if (!invite) return false; //If the invite doesn't exist, ignore and return false.
    invites.splice(invites.indexOf(invite), 1);
    this._setInvites(guildId, invites);
    return true;
  }

  async removeInviteByCode(guildId, code, createIfNotExist = true) {
    const invites = await this.getInvites(guildId, createIfNotExist);
    const invite = await this.getInviteByCode(guildId, code, createIfNotExist);
    if (!invite) return false; //If the invite doesn't exist, ignore and return false.
    invites.splice(invites.indexOf(invite), 1);
    this._setInvites(guildId, invites);
    return true;
  }

  async setInvite(guildId, name, code, createIfNotExist = true) {
    const invites = await this.getInvites(guildId, createIfNotExist);
    const index = invites.findIndexOf((invite) => invite.name == name);
    if (index === -1) return false;

    const invite = invites[index];
    //If the invite doesn't exist or no fields are going to be changed, return false;
    if (!invite || (invite.name === name && invite.code === code)) return false;

    invites[index].name = name;
    invites[index].code = code;
    this._setInvites(invites);
    return true;
  }

  async _setInvites(guildId, invites) {
    const guild = await this._guild.getGuild(guildId);
    guild.invites = invites;
    guild.save();
  }
}

class ChannelsHandler {
  constructor() {
    this._guild = new GuildHandler();
  }

  createChannels() {}

  async getChannels(guildId, createIfNotExist = true) {
    const customGuildId = await this._guild.getId(guildId, createIfNotExist);
    if (!customGuildId) return null;
    const channels = await Channel.findOne({ where: { guildId: customGuildId } });
    if (channels) return channels;
    return await Channel.create({ guildId: customGuildId });
  }

  //DO NOT USE THIS METHOD UNLESS NECESSARY. Use the specific field methods below!
  async getField(guildId, field, createIfNotExist = true) {
    const channels = await this.getChannels(guildId, createIfNotExist);
    if (!channels) return;
    return channels.get(field);
  }

  async getWelcome(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "welcome", createIfNotExist);
  }

  async getOpportunity(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "opportunity", createIfNotExist);
  }

  async getAuditLog(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "auditLog", createIfNotExist);
  }

  async getMemberCounter(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "memberCounter", createIfNotExist);
  }
  async getThreadDirectory(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "threadDirectory", createIfNotExist);
  }

  async getTeamsAndProjects(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "teamsAndProjects", createIfNotExist);
  }

  async getNewUserMention(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "newUserMention", createIfNotExist);
  }

  async getIntroductions(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "introductions", createIfNotExist);
  }

  async getInvites(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "invites", createIfNotExist);
  }

  async getMinecraft(guildId, createIfNotExist = true) {
    return await this.getField(guildId, "minecraft", createIfNotExist);
  }

  async setField(guildId, field, newValue, createIfNotExist = true) {
    const channels = await this.getChannels(guildId, createIfNotExist);
    channels[field] = newValue;
    channels.save();
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

module.exports = new DatabaseHandler();
