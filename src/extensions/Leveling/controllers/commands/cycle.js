module.exports.help = {
	name: "cycle",
	description: "Shows the currenct message cycle of the bot.",
	usage: `cycle`,
	example: `cycle`,
};

module.exports.conf = {
	aliases: ["c"],
	cooldown: 20,
};

module.exports.run = async (client, message, args) => {
	const LevelManager = require("../../structures/LevelManager");
	let levelingManager = new LevelManager(message.guild);
	levelingManager.onCycle(message);
};
