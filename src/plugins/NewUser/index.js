module.exports = {
  name: "NewUser",
  helpCategory: "NewUser",
  helpPage: 5,
  commands: [],
  events: [
    require("./controllers/events/onNewUserSendMessage.js"),
    require("./controllers/events/onNewUserEditMessage.js"),
  ],
  extends: [],
  structures: [require("./structures/NewUserHandler.js")],
  permissions: ["ADMINISTRATOR"],
};
