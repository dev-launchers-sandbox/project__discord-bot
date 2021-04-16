const removeReaction = async (message, reaction, user) => {
	if (message.partial) await message.fetch(); //Make sure we have the most updated message
	let emojiReactions = message.reactions.resolve(reaction);
	if (emojiReactions) {
		let users = await reactions.users.fetch(); //fetch all the users that reacted
		reactions.users.remove(user); //remove the reaction of "user"
	}
};

module.exports = { removeReaction };
