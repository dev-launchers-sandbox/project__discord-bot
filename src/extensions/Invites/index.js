module.exports = {
	name: "Invites",
	helpCategory: "Invites",
	helpPage: 2,
	commands: [
		require("./controllers/commands/addInvite.js"),
		require("./controllers/commands/getInvites.js"),
		require("./controllers/commands/removeInvite.js"),
	],
	events: [
		require("./controllers/events/inviteOnCreate.js"),
		require("./controllers/events/inviteOnGuildMemberAdd.js"),
		require("./controllers/events/inviteOnReady.js"),
	],
	extends: [],
	structures: [require("./structures/InviteHandler.js")],
	permissions: ["ADMINISTRATOR"],
};
