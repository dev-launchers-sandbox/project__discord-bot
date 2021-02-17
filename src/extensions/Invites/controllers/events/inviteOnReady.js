const inviteHandler = require("./../../structures/InviteHandler.js");

module.exports.eventHandle = "ready";
module.exports.event = async (client) => {
	inviteHandler.fetchInvites(client);
};
