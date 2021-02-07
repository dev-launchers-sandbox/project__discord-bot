exports.help = {
    name: "listgames",
    description: "Lists all current games that are being played.",
    usage: `listgames`,
    example: `listgames`,
};

exports.conf = {
    aliases: ["lg", "list", "games"],
    cooldown: 5,
};

exports.run = async(client, message) => {
    const ChessManager = require('../../helpers/NewChessManager');
    let chessManager = new ChessManager();

    chessManager.listGames(message);
};