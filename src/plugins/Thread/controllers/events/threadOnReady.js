const Thread = require("../../structures/Thread.js");
const TaskManager = require("../../../.common/structures/Tasks/TaskManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const metrics = require("../../../../index.js");

exports.eventHandle = "ready";
exports.event = async (client) => {
  metrics.sendEvent("ready");
  let taskManager = new TaskManager();

  const checkThreads = () => {
    let threads = dbh.thread.getThreads();
    if (!threads) return;
    threads.forEach((t) => {
      let thread = new Thread(
        client,
        dbh,
        t.guildId,
        t.id,
        t.channelId,
        t.roleId,
        t.threadCreatorId,
        t.isPublic,
        t.directoryMessageId,
        t.description,
        t.lastReminder,
      );
      thread.checkDelete();
    });
  };

  taskManager.addTask(checkThreads, 1000 * 60);
};
