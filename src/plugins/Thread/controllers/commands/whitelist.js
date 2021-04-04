const ThreadManager = require("./../../structures/ThreadManager.js");
const getMessageTarget = require("../../../../utils/getMessageTarget");

exports.help = {
  name: "whitelist",
  description: "Whitelists a member from an thread",
  usage: "Whitelists <@user>",
  example: "Whitelists @Wumpus#0001",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: ["User"]
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

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) {
    channel.sendEmbed({ color: 0xff9f01, description: "User not found" });
    return;
  }

  if (ThreadManager.hasThreadPermissions(thread.id, target)) {
    channel.sendEmbed({ color: 0xff9f01, description: "The user is an admin or the owner of the thread" });
    return;
  }

  if (!thread.blacklist.includes(target.id)) {
    channel.sendEmbed({ color: 0xff9f01, description: "The user is not blacklisted" });
    return;
  }

  ThreadManager.whitelistUser(message.guild, thread.id, target.id, channel);
  channel.sendEmbed({ color: 0xff9f01, description: `<@${target.id}> is no longer blacklisted from this thread.` });
};
