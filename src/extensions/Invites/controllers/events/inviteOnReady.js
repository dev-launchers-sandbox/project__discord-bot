const inviteHandler = require("./../../structures/InviteHandler.js");

exports.eventHandle = "ready";
exports.event = async (client) => {
  inviteHandler.fetchInvites(client);
};
