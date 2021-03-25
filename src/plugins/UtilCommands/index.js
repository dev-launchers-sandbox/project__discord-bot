module.exports = {
  name: "UtilCommands",
  helpCategory: "Utils",
  helpPage: 4,
  commands: [
    require("./controllers/commands/reactTo.js"),
    require("./controllers/commands/createInvite.js"),
    require("./controllers/commands/addThreadCustomInvite.js"),
  ],
  events: [],
  extends: [],
  structures: [],
  permissions: ["MANAGE_ROLES"],
};
