const inviteHandler = require("./../../structures/InviteHandler.js");

module.exports.eventHandle = "inviteCreate";
module.exports.event = async (client, invite) => {
	inviteHandler.fetchNewInvite(invite);
};
