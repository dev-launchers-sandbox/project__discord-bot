const metrics = require("../../../../index.js");
const newUserHandler = require("./../../structures/NewUserHandler.js");

exports.eventHandle = "messageUpdate";
exports.event = async (client, oldMessage, newMessage) => {
  metrics.sendEvent("messageUpdate");

  newUserHandler.giveRoles(newMessage);
};
