module.exports = {
  name: "General",
  helpCategory: "General",
  helpPage: 1,
  commands: [
    require("./controllers/commands/help.js"),
    require("./controllers/commands/info.js"),
    require("./controllers/commands/ping.js"),
    require("./controllers/commands/poll.js"),
    require("./controllers/commands/serverinfo.js"),
  ],
  events: [],
  extends: [],
  structures: [],
  permissions: [],
};
