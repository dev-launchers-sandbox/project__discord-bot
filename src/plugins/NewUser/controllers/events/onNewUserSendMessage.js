const metrics = require("./../../../../index.js");
const newUserHandler = require("./../../structures/NewUserHandler.js");

exports.eventHandle = "message";
exports.event = async (client, message, args) => {
  metrics.sendEvent("message");

  //newUserHandler.giveRoles(message);
};
