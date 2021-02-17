const ThreadManager = require("./../../structures/ThreadManager.js");

exports.help = {
  name: "leave",
  description: `Use this command to leave a thread`,
  usage: "leave",
  example: "leave",
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

  message.member.roles.remove(thread.roleId);
  channel.send(`<@${message.author.id}> has left the thread.`);
};
