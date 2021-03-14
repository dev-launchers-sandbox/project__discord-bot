const ThreadManager = require("./ThreadManager.js");

class Thread {
  constructor(
    client,
    dbh,
    guildId,
    id,
    channelId,
    roleId,
    threadCreatorId,
    isPublic,
    directoryMessageId,
    description,
    lastReminder,
  ) {
    this._client = client;
    this._dbh = dbh;
    this._guildId = guildId;
    this._id = id;
    this._channelId = channelId;
    this._roleId = roleId;
    this._threadCreatorId = threadCreatorId;
    this._isPublic = isPublic;
    this._directoryMessageId = directoryMessageId;
    this._description = description;
    this._lastReminder = lastReminder;
  }

  async checkDelete() {
    if (await this.isOverdue()) {
        await this.remove();
    }
  }

  async isOverdue() {
    let guild = this._client.guilds.resolve(this._guildId);
    if (!guild) return true;
    let channel = guild.channels.resolve(this._channelId);
    if (!channel) return true;

    if (ThreadManager.getMembersInThread(this._client, this._guildId, this._id) === 0) return true;

    let maxInactivityTime = (this._dbh.thread.getMaxInactivityTime(guild.id) * 3.84e+6) || 8.64e+7;
    let lastMessageTime = await this.getLastMessageTime(guild, channel);
    
    let timeSinceLastMessage = Date.now() - lastMessageTime;
    let isOverdue = timeSinceLastMessage > maxInactivityTime;

    if (!isOverdue && timeSinceLastMessage > (maxInactivityTime * 0.9) && !this.isReminderInCooldown()) {
      ThreadManager.setLastReminder(this._id, Date.now());
      channel.sendEmbed({ color:0xff9f01, description: `Don't let this thread die! Be a hero and send a message!` });
    }

    return isOverdue;
  }

  async getLastMessageTime(guild, channel) {
    //Threads younger than 5m will get ignored.
    if ((Date.now() - new Date(channel.createdAt).getTime() < (60 * 5 * 1000))) return Number.MAX_SAFE_INTEGER;

    let messages = await channel.messages.fetch({ limit: 10 });
    messages = messages.filter(msg => msg.author.bot == false);
    let lastMessage = messages.first();
    if (!lastMessage) return 0; //Automatically delete.
    return lastMessage.createdTimestamp;
  }

  isReminderInCooldown() {
    let maxInactivityTime = (this._dbh.thread.getMaxInactivityTime(this._guildId) * 3.84e+6) || 8.64e+7;
    if (this._lastReminder == null) return false;

    return (Date.now() - this._lastReminder)  < maxInactivityTime;
  }

  async remove() {
    this._dbh.thread.removeThread(this._id);
    let guild = this._client.guilds.resolve(this._guildId);
    if (!guild) return;

    let channel = guild.channels.resolve(this._channelId);
    if (channel) channel.delete();
    let role = guild.roles.resolve(this._roleId);
    if (role) role.delete();

    if (this._directoryMessageId) {
      let directoryChannelId = this._dbh.thread.getDirectoryChannelId(this._guildId) || "none";
      let directoryChannel = guild.channels.resolve(directoryChannelId);
      if (!directoryChannel) return;
      let directoryMessage = await directoryChannel.messages.fetch(this._directoryMessageId);
      if (directoryMessage) directoryMessage.delete();
    }
  }
}

module.exports = Thread;
