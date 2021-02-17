const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("TextChannel", (TextChannel) => {
	class AccountabilityChannelExtension extends TextChannel {
		constructor(guild, data) {
			super(guild, data);
		}
	}

	return AccountabilityChannelExtension;
});
