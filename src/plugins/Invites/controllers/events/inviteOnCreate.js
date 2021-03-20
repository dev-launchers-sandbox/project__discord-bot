const inviteHandler = require("./../../structures/InviteHandler.js");

exports.eventHandle = "inviteCreate";
exports.event = async (client, invite) => {
  inviteHandler.fetchNewInvite(invite);
};
