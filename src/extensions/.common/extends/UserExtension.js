const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("User", (User) => {
	class UserExtension extends User {
		constructor(client, data) {
			super(client, data);
		}

		hasPermissions(channel) {}

		warn() {}

		ban() {}

		async sendEmbed(args) {
			const embed = new Discord.MessageEmbed();
			if (args.color) embed.setColor(args.color);
			if (args.thumbnail) embed.setThumbnail(args.thumbnail);
			if (args.url) embed.setURL(args.url);

			if (args.title) embed.setTitle(args.title);
			if (args.author)
				embed.setAuthor(
					args.author.name,
					args.author.image && args.author.image
				);

			if (args.description) embed.setDescription(args.description);
			if (args.fields) {
				args.fields.map((field) =>
					embed.addField(field.name, field.value, field.inline)
				);
			}

			if (args.footer) embed.setFooter(args.footer);
			if (args.timestamp) embed.setTimestamp(args.timestamp);

			try {
				return await this.send(embed);
			} catch (err) {
				console.log("User's DMs are off");
			}
		}

		async sendAction(guildName, reason, action) {
			await this.sendEmbed({
				color: 0xff9f01,
				author: {
					name: `You have been ${action} from: ${guildName}`,
					image: this.displayAvatarURL(),
				},
				description: `Reason: ${reason || "No Reason Provided"}`,
				timestamp: true,
			});
		}
	}

	return UserExtension;
});
