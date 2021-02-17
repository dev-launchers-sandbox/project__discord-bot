module.exports = {
	name: "Minecraft",
	helpCategory: "Minecraft",
	helpPage: 4,
	commands: [
		require("./controllers/commands/minecraft.js"),
		require("./controllers/commands/mcip.js"),
	],
	events: [],
	extends: [],
	structures: [],
	permissions: [],
};
