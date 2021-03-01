const ThreadManager = require("../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const metrics = require("../../../../index.js");

exports.eventHandle = "messageReactionRemove";
exports.event = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_remove");
  if (user.bot) return;
  let message = messageReaction.message;
  let thread = getThread(messageReaction);

  if (!thread) return;
  let guild = message.guild;
  if (!guild) return;
  let threadChannel = guild.channels.resolve(thread.channelId);
  if (!threadChannel) return;

  let member = guild.members.resolve(user.id);

  if (member.roles.cache.find((r) => r.id === thread.roleId)) {
    member.roles.remove(thread.roleId);
    threadChannel.send(`${member.toString()} left the thread.`);
  }
};

function getThread(messageReaction) {
  let threads = dbh.thread.getThreads();
  let message = messageReaction.message;
  let thread;

  if (messageReaction.emoji.name === "🧵") {
    thread = threads.find((t) => t.invites.includes(message.id));
  } else {
    thread = threads.find((t) => {
      if (!t.customInvites) return false;
      return t.customInvites.find(
        (i) =>
          i.id === message.id &&
          i.reaction ===
            `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`
      );
    });
  }
  return thread;
}
