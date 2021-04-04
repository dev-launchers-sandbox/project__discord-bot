module.exports = {
  name: "Threads",
  helpCategory: "Threads",
  helpPage: 3,
  commands: [
    require("./controllers/commands/blacklist.js"),
    require("./controllers/commands/convertPublic.js"),
    require("./controllers/commands/create.js"),
    require("./controllers/commands/description.js"),
    require("./controllers/commands/invite.js"),
    require("./controllers/commands/keepThread.js"),
    require("./controllers/commands/leave.js"),
    require("./controllers/commands/rename.js"),
    require("./controllers/commands/users.js"),
    require("./controllers/commands/whitelist.js"),
  ],
  events: [
    require("./controllers/events/threadOnMessage.js"),
    require("./controllers/events/threadOnReady.js"),
    require("./controllers/events/threadOnReactionRemove.js"),
    require("./controllers/events/threadOnReactionAdd.js"),
  ],
  extends: [],
  structures: [
    require("./structures/Thread.js"),
    require("./structures/ThreadManager.js"),
  ],
  permissions: [],
};
