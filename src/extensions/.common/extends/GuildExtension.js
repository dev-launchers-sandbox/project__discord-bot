const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("Guild", (Guild) => {
	class GuildExtension extends Guild {
		constructor(client, data) {
			super(client, data);
		}
	}

	return GuildExtension;
});
