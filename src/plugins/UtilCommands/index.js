module.exports = {
  name: "UtilCommands",
  helpCategory: "Utils",
  helpPage: 4,
  commands: [
    require("./controllers/commands/reactTo.js"),
    require("./controllers/commands/createInvite.js"),
    require("./controllers/commands/addThreadCustomInvite.js"),
    require("./controllers/commands/removeBeans.js"),
    require("./controllers/commands/addWarning.js"),
    require("./controllers/commands/createUser.js"),
    require("./controllers/commands/getWarnings.js"),
    require("./controllers/commands/delete.js"),
  ],
  events: [],
  extends: [],
  structures: [],
  permissions: ["MANAGE_ROLES"],
};
