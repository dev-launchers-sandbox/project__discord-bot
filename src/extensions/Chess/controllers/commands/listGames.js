module.exports.help = {
	name: "listgames",
	description: "Lists all current games that are being played.",
	usage: `listgames`,
	example: `listgames`,
};

module.exports.conf = {
	aliases: ["lg", "list", "games"],
	cooldown: 5,
};

module.exports.run = async (client, message) => {
	const ChessManager = require("../../structures/ChessManager");
	let chessManager = new ChessManager();

	chessManager.listGames(message);
};
