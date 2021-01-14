module.exports = {
  name: "UtilCommands",
  helpCategory: "Utils",
  commands: [
    require("./controllers/commands/reactTo.js"),
    require("./controllers/commands/createInvite.js"),
  ],
  events: [],
  extends: [],
  structures: [],
};
