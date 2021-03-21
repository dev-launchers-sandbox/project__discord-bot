const dbh = require("../../.common/structures/DataHandling/DatabaseHandler.js");

class ThreadManager {
  constructor() {}

  async createThread(client, guild, channel, threadName, threadCreatorId, isPublic) {
    let role = await guild.roles.create({ data: { name: threadName } });
    let threadChannel = await guild.channels.create(threadName);
    let threadCreator = guild.members.resolve(threadCreatorId);

    threadChannel.updateOverwrite(guild.roles.everyone, {
      VIEW_CHANNEL: false,
    });
    threadChannel.updateOverwrite(role.id, {
      VIEW_CHANNEL: true,
    });
    threadChannel.updateOverwrite(threadCreatorId, {
      MANAGE_MESSAGES: true,
    });

    let threadsCategory = dbh.thread.getThreadCategory(guild.id);
    threadChannel.setParent(threadsCategory);

    threadChannel.sendEmbed({
      color: 0xff9f01,
      description: `Welcome to **${threadName}**\nA thread created by <@${threadCreatorId.toString()}>`,
    });

    let threadInvite = await channel.sendEmbed({
      color: 0xff9f01,
      description: `To join the thread **${threadName}**, created by ${threadCreator.toString()}, click on the reaction.`,
    });

    threadCreator.roles.add(role.id);
    threadChannel.send(`${threadCreator.toString()}`).then(m => m.delete());
    threadInvite.react("🧵");

    let directoryMessage = null;
    if (isPublic) {
      directoryMessage = await this.sendDirectoryMessage(guild, threadName);
    }

    let moderationServerId = dbh.thread.getModerationServer(guild.id);
    let moderationServer = client.guilds.resolve(moderationServerId);
    let moderationChannel;

    if (moderationServer) {
      moderationChannel = await moderationServer.channels.create(threadChannel.name);
      moderationChannel.send(`Thread ${threadChannel.name} has been created by ${threadCreator.toString()}`)
    }

    let thread = {
      guildId: guild.id,
      id: threadChannel.id, //the id of threads is the same as the channel ID
      channelId: threadChannel.id,
      roleId: role.id,
      threadCreatorId: threadCreatorId,
      invites: [threadInvite.id],
      blacklist: [],
      isPublic: isPublic,
      directoryMessageId: directoryMessage ? directoryMessage.id : null,
      description: null,
      moderationChannelId: moderationChannel ? moderationChannel.id : null,
      lastNameChange: null,
      lastDescriptionChange: null,
      lastReminder: null,
    };

    if (directoryMessage) {
      thread.invites.push(directoryMessage.id);
    }

    dbh.thread.addThread(guild.id, thread);
  }

  getThreadById(id) {
    let threads = dbh.thread.getThreads();
    if (threads) {
      return threads.find((t) => t.id === id);
    }
    return false;
  }

  async sendDirectoryMessage(guild, threadName, description) {
    let directoryChannelId = dbh.thread.getDirectoryChannelId(guild.id);
    if (directoryChannelId == null) return;

    let directoryChannel = guild.channels.resolve(directoryChannelId);
    if (directoryChannel == null) return;

    let directoryMessage = await directoryChannel.sendEmbed({
      color: 0xff9f01,
      title: threadName + " thread",
      description: description ? description : "Description: *No Description*",
      footer: "React to this message to join the thread!",
    });

    directoryMessage.react("🧵")
    return directoryMessage;
  }

  async updateDirectoryInvite(client, threadId, name, description) {
    let thread = this.getThreadById(threadId);
    const { MessageEmbed } = require("discord.js")
    let newEmbed = new MessageEmbed()
      .setColor(0xff9f01)
      .setTitle(name + " thread")
      .setDescription(`Description: *${description ? description : "No description"}*`)
      .setFooter("React to this message to join the thread!");

    let directoryChannelId = dbh.thread.getDirectoryChannelId(thread.guildId);
    let directoryChannel = client.channels.resolve(directoryChannelId);
    let directoryMessage = await directoryChannel.messages.fetch(thread.directoryMessageId);

    directoryMessage.edit(newEmbed);
  }

  blacklistUser(guild, threadId, userId, channel) {
    let thread = this.getThreadById(threadId);
    if (!thread) return;

    let member = guild.members.resolve(userId);
    if (member) {
      thread.blacklist.push(userId);
      member.roles.remove(thread.roleId);
      member.user.sendEmbed({ color: 0xff9f01, description: `You have been blacklisted from ${channel.name}` });
    }

    dbh.thread.updateThread(threadId, thread);
  }

  whitelistUser(guild, threadId, userId, channel) {
    let thread = this.getThreadById(threadId);
    if (!thread) return;

    let member = guild.members.resolve(userId);
    if (member) {
      thread.blacklist = thread.blacklist.filter(u => u !== userId);
      member.user.sendEmbed({ color: 0xff9f01, description: `You have been whitelisted from ${channel.name}` });
    }

    dbh.thread.updateThread(threadId, thread);
  }

  hasThreadPermissions(threadId, user) {
    let thread = this.getThreadById(threadId);
    return user.permissions.has("ADMINISTRATOR") || thread.threadCreatorId === user.id;
  }

  async convertToPublic(client, threadId) {
    let thread = this.getThreadById(threadId);
    thread.isPublic = true;

    let guild = client.guilds.resolve(thread.guildId);
    if (!guild) return;
    let channel = guild.channels.resolve(thread.channelId);
    if (!channel) return;

    let directoryMessage = await this.sendDirectoryMessage(guild, channel.name, thread.description);
    thread.directoryMessage = directoryMessage.id;
    dbh.thread.updateThread(threadId, thread);
  }

  async updateThreadDescription(client, threadId, description) {
    let thread = this.getThreadById(threadId);
    thread.description = description;

    let guild = client.guilds.resolve(thread.guildId);
    if (!guild) return;
    let channel = guild.channels.resolve(thread.channelId);
    if (!channel) return;

    channel.setTopic(thread.description);

    if (thread.isPublic) {
      this.updateDirectoryInvite(client, thread.id, channel.name, thread.description);
    }
    dbh.thread.updateThread(threadId, thread);
  }

  async createInvite(client, threadId, channel) {
    let thread = this.getThreadById(threadId);

    let guild = client.guilds.resolve(thread.guildId);
    if (!guild) return;
    let threadChannel = guild.channels.resolve(thread.channelId);
    if (!threadChannel) return;

    let newInvite = await channel.sendEmbed({
      color: 0xff9f01,
      description: `To join the thread **${threadChannel.name}**, created by <@${thread.threadCreatorId}>, click on the reaction.`,
    });

    newInvite.react("🧵");

    thread.invites.push(newInvite.id);
    dbh.thread.updateThread(threadId, thread);
  }

  getMembersInThread(client, guildId, threadId) {
    let guild = client.guilds.resolve(guildId)
    if (!guild) return 0;
    let thread = this.getThreadById(threadId);
    let role = guild.roles.resolve(thread.roleId);
    if (!role) return 0;
    return role.members.size;
  }

  setLastReminder(threadId, now) {
    let thread = this.getThreadById(threadId);
    if (thread) {
      thread.lastReminder = now;
      dbh.thread.updateThread(thread.id, thread);
    }
  }

  getModerationChannel(client, threadId) {
    let thread = this.getThreadById(threadId);
    if (!thread) return;
    if (!thread.moderationChannelId) return null;

    let moderationServerId = dbh.thread.getModerationServer(thread.guildId);
    if (!moderationServerId) return null;
    let moderationServer = client.guilds.resolve(moderationServerId);
    if (!moderationServer) return null;

    let moderationChannel = moderationServer.channels.resolve(thread.moderationChannelId);
    return moderationChannel;
  }
}

module.exports = new ThreadManager();
