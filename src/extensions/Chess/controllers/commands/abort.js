exports.help = {
    name: "abort",
    description: "Aborts the current game being played",
    usage: `abort`,
    example: `abort`,
};

exports.conf = {
    aliases: ["a", "abort"],
    cooldown: 5,
};

exports.run = async(client, message) => {
    const ChessManager = require('../../helpers/NewChessManager');
    let chessManager = new ChessManager();

    chessManager.abort(message);
};