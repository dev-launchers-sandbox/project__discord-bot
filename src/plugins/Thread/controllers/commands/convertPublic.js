const ThreadManager = require("./../../structures/ThreadManager.js");

exports.help = {
  name: "convertpublic",
  description: "Converts a private thread to public",
  usage: "convertpublic",
  example: "convertpublic",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let thread = ThreadManager.getThreadById(channel.id); //The channel id is the same as the thread id.

  if (!thread) {
    channel.sendEmbed({ color: 0xff9f01, description: "This command is only available for threads." });
    return;
  }

  if (!(ThreadManager.hasThreadPermissions(thread.id, message.member))) {
    channel.sendEmbed({ color: 0xff9f01, description: "You don't have perms to run this command!" });
    return;
  }

  if (thread.isPublic) {
    channel.sendEmbed({ color: 0xff9f01, description: "The thread is already public" });
    return;
  }

  ThreadManager.convertToPublic(client, thread.id)
  channel.sendEmbed({ color: 0xff9f01, description: `This thread is now public` });
}
