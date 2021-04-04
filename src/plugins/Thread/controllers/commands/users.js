const ThreadManager = require("./../../structures/ThreadManager.js");

exports.help = {
  name: "users",
  description: `Shows the number of users in a thread`,
  usage: "users",
  example: "users",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let channel = message.mentions.channels.first() || message.channel;
  let thread = ThreadManager.getThreadById(channel.id );

  if (!thread) {
    channel.sendEmbed({ color: 0xff9f01, description: "This command is only available for threads." });
    return;
  }

  let userCount = await ThreadManager.getMembersInThread(client, message.guild.id, thread.id);

  if (userCount === 1) {
    message.channel.sendEmbed({ color: 0xff9f01, description: `There is **${1}** member in the thread.` });
  } else {
    message.channel.sendEmbed({ color: 0xff9f01, description: `There are **${userCount}** members in the thread.` });
  }
}
