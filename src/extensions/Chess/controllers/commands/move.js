module.exports.help = {
    name: "move",
    description: "Makes a move on the chessboard.",
    usage: `move [AN formatted move]`,
    example: `move e4`,
};

module.exports.conf = {
    aliases: ["m"],
    cooldown: 0,
};

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.reply("please provide a move.")

    const ChessManager = require('../../structures/ChessManager');
    let chessManager = new ChessManager();

    chessManager.move(client, message, args[0])
};