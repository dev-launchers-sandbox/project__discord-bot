const getMessageTarget = require("../../../../utils/getMessageTarget");

module.exports.help = {
	name: "challenge",
	description: "challenges a user",
	usage: `challenge [@user]`,
	example: `challenge @Hextanium#5890`,
};

module.exports.conf = {
	aliases: ["c", "chall", "duel"],
	cooldown: 5,
};

module.exports.run = async (client, message, args) => {
	let target = getMessageTarget.getMessageTarget(message, args);
	if (!target) target = message.guild.members.resolve(message.author.id);
	if (target.user.bot) {
		return message.channel.send(
			"Hey, you can't challenge a bot! They're honestly just too good, I think they're using an engine..."
		);
	} else if (target.user) {
		const ChessManager = require("../../structures/ChessManager");
		let chessManager = new ChessManager();

		chessManager.challenge(client, message, [
			message.author.id,
			target.user.id,
		]);
	} else {
		return message.channel.send("That does not appear to be a user.");
	}
};
