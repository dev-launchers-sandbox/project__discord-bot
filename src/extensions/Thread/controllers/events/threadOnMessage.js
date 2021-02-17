const ThreadManager = require("../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const metrics = require("../../../../index.js");

exports.eventHandle = "message";
exports.event = async (client, message, args) => {
  metrics.sendEvent("message");
  let thread = ThreadManager.getThreadById(message.channel.id);
  if (!thread) return;

  let moderationChannel = ThreadManager.getModerationChannel(client, thread.id);

  if (moderationChannel && !moderationChannel.deleted) {
      moderationChannel.send(`${message.author.toString()} -- ${message.content}`);
  }
};
