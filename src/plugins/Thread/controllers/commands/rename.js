const ThreadManager = require("./../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");

exports.help = {
  name: "rename",
  description: `Rename a thread`,
  usage: "rename <name>",
  example: "rename music club",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: ["Name"]
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

  let threadName = args.join("-");
  threadName = threadName.replace(/[^A-z0-9-]/g, "");

  if (threadName.length > 30) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `Thread names have a max of **30** characters. Please make your name ${threadName.length- 30} smaller`,
    });
    return;
  }

  let cooldown = getCooldown(thread.lastNameChange);
  if (cooldown) {
    channel.sendEmbed({
      color: 0xff9f01,
      description:
      `You need to wait **${cooldown.minutes && `${cooldown.minutes} minute(s) and`} ${cooldown.seconds} second(s)** before changing the name again!`
    });
    return;
  }


  message.channel.setName(threadName);

  //If there is a moderationChannel, also update the name. This helps keep names consistent.
  let moderationChannel = ThreadManager.getModerationChannel(client, thread.id);
  if (moderationChannel) moderationChannel.setName(threadName);

  //Private threads don't appear in the directory.
  if (thread.isPublic) ThreadManager.updateDirectoryInvite(client, thread.id, threadName, thread.description);

  let role = message.guild.roles.resolve(thread.roleId);
  if (role) role.setName(threadName);

  //Update the date because of Discord's rate limit. (2 changes x 10 minutes)
  thread.lastNameChange = Date.now();
  dbh.thread.updateThread(thread.id, thread);
  channel.sendEmbed({ color: 0xff9f01, description: `The name has been updated to **${threadName}**`});
};

function getCooldown(lastNameChange) {
  let cooldown = 300000;
  let pad_zero = (num) => (num < 10 ? "0" : "") + num;
  if (lastNameChange !== null && cooldown - (Date.now() - lastNameChange) > 0) {
    let timeObj = ms(cooldown - (Date.now() - lastNameChange));
    let minutes = pad_zero(timeObj.minutes).padStart(2, "");
    let seconds = pad_zero(timeObj.seconds).padStart(2, "");
    return {minutes: minutes, seconds: seconds};
  } else return false;
}
