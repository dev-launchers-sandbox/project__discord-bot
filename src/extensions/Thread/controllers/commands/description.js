const ThreadManager = require("./../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");

exports.help = {
  name: "description",
  description: "Sets the description for a thread",
  usage: `description <content>`,
  example: `description we love potatoes!`,
};

exports.conf = {
  aliases: [],
  cooldown: 25,
  arguments: ["Description"]
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

  let cooldown = getCooldown(thread.lastDescriptionChange);
  if (cooldown) {
    channel.sendEmbed({
      color: 0xff9f01,
      description:
      `You need to wait **${cooldown.minutes && `${cooldown.minutes} minute(s) and`} ${cooldown.seconds} second(s)** before changing the description again!`
    })
    return;
  }

  let description = args.join(" ");
  if (description.length > 50) {
    channel.sendEmbed({
      color: 0xff9f01,
      description: `Descriptions have a max of **50** characters. Please make your name ${description.length- 30} smaller`,
    })
    return;
  }

  channel.setTopic(description);
  thread.lastDescriptionChange = Date.now();
  dbh.thread.updateThread(thread.id, thread);

  ThreadManager.updateThreadDescription(client, thread.id, description);
  channel.sendEmbed({ color: 0xff9f01, description: `The description has been updated to **${description}**`});
}

function getCooldown(lastDescriptionChange) {
  let cooldown = 300000;
  let pad_zero = (num) => (num < 10 ? "0" : "") + num;
  if (lastDescriptionChange !== null && cooldown - (Date.now() - lastDescriptionChange) > 0) {
    let timeObj = ms(cooldown - (Date.now() - lastDescriptionChange));
    let minutes = pad_zero(timeObj.minutes).padStart(2, "");
    let seconds = pad_zero(timeObj.seconds).padStart(2, "");
    return {minutes: minutes, seconds: seconds};
  } else return false;
}
