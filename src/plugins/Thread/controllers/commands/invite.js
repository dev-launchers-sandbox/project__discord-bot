const ThreadManager = require("./../../structures/ThreadManager.js");

exports.help = {
  name: "invite",
  description: "Creates an invite to a thread",
  usage: "invite <#channel>",
  example: "invite #secret-chat",
};

exports.conf = {
  aliases: [],
  cooldowns: 10,
  arguments: ["Thread"],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let threadChannel = message.mentions.channels.first();
  if (!threadChannel) {
    channel.sendEmbed({ color: 0xff9f01, description: "Specify the thread for the invite" });
    return;
  }

  let thread = ThreadManager.getThreadById(threadChannel.id); //The channel id is the same as the thread id.

  if (!thread) {
    channel.sendEmbed({ color: 0xff9f01, description: "This channel is not a thread." });
    return;
  }

  if (!thread.isPublic) {
    if (!(ThreadManager.hasThreadPermissions(thread.id, message.member))) {
      channel.sendEmbed({ color: 0xff9f01, description: "The thread is private, only the owner can do this." });
      return;
    }
  }

  ThreadManager.createInvite(client, thread.id, message.channel);
};
