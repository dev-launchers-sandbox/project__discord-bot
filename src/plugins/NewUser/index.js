module.exports = {
  name: "NewUser",
  helpCategory: "NewUser",
  helpPage: 5,
  commands: [
    require("./controllers/commands/addRole.js"),
    require("./controllers/commands/roles.js"),
    require("./controllers/commands/removeRole.js"),
  ],
  events: [require("./controllers/events/onNewUserSendMessage.js")],
  extends: [],
  structures: [],
  permissions: ["ADMINISTRATOR"],
};
