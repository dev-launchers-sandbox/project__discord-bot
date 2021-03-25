const Discord = require("discord.js");
const ThreadManager = require("./../../../Thread/structures/ThreadManager.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "addThreadCustomInvite",
  description: "Creates a custom thread invite.",
  usage: "addThreadCustomInvite <id> <emoji>",
  example: "addThreadCustomInvite 815606090183606323 👍",
};

exports.conf = {
  aliases: ["addcustom"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Message Id"],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;

  let thread = ThreadManager.getThreadById(channel.id); //The channel id is the same as the thread id.

  if (!thread) {
    channel.sendEmbed({
      color: 0xff9f01,
      description: "This channel is not a thread.",
    });
    return;
  }

  if (thread.customInvites) {
    thread.customInvites.push({ id: args[0], reaction: args[1] });
  } else thread.customInvites = [{ id: args[0], reaction: args[1] }];
  dbh.thread.updateThread(thread.id, thread);

  channel.send("It should have worked!");
};
