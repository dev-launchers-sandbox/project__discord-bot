module.exports.help = {
    name: "abort",
    description: "Aborts the current game being played",
    usage: `abort`,
    example: `abort`,
};

module.exports.conf = {
    aliases: ["a", "abort"],
    cooldown: 5,
};

module.exports.run = async(client, message) => {
    const ChessManager = require('../../structures/ChessManager');
    let chessManager = new ChessManager();

    chessManager.abort(message);
};