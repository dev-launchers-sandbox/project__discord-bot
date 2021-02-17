const ThreadManager = require("../../structures/ThreadManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const metrics = require("../../../../index.js");

exports.eventHandle = "messageReactionRemove";
exports.event = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_remove");
  if (user.bot) return;
  if (messageReaction.emoji.name === "🧵") {
    let message = messageReaction.message;
    let threads = dbh.thread.getThreads();

    const thread = threads.find((t) => t.invites.includes(message.id));

    if (!thread) return;
    let guild = message.guild;
    if (!guild) return;
    let threadChannel = guild.channels.resolve(thread.channelId);
    if (!threadChannel) return;

    let member = guild.members.resolve(user.id);

    if (member.roles.cache.find((r) => r.id === thread.roleId)) {
      member.roles.remove(thread.roleId);
      threadChannel.send(`${member.toString()} has left the thread.`);
    }
  }
};
