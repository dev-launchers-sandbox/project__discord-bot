const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("User", (User) => {
	class AccountabilityUserExtension extends User {
		constructor(client, data) {
			super(client, data);
		}
	}

	return AccountabilityUserExtension;
});
