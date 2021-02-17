const ThreadManager = require("./../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "keepthread",
  description: `Removes a channel from the "thread" list`,
  usage: "keepthread",
  example: "keepthread",
};

exports.conf = {
  aliases: ["keep"],
  cooldown: 5,
  permissions: ["MANAGE_CHANNELS"],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let thread = ThreadManager.getThreadById(channel.id); //The channel id is the same as the thread id.

  if (!thread) {
    channel.sendEmbed({ color: 0xff9f01, description: "This command is only available for threads." });
    return;
  }

  dbh.thread.removeThread(channel.id);
  message.channel.sendEmbed({color: 0xff9f01, description: `**${channel.name}** is no longer a thread.`});

};
