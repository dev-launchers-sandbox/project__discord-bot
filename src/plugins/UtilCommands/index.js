module.exports = {
	name: "UtilCommands",
	helpCategory: "Utils",
	helpPage: 4,
	commands: [
		require("./controllers/commands/reactTo.js"),
		require("./controllers/commands/createInvite.js"),
		require("./controllers/commands/addThreadCustomInvite.js"),
		require("./controllers/commands/removeBeans.js"),
		require("./controllers/commands/removeReaction.js"),
	],
	events: [],
	extends: [],
	structures: [],
	permissions: ["MANAGE_ROLES"],
};
