const Discord = require("discord.js");
const db = require("quick.db");

module.exports.help = {
	name: "endseason2",
	description: "Ends the current bean season",
	usage: `endSeason`,
	example: `endSeason`,
};

module.exports.conf = {
	aliases: ["end"],
	cooldown: 5,
	permissions: ["ADMINISTRATOR"],
};

module.exports.run = async (client, message, args) => {
	if (!client.config.contributors.includes(message.author.id)) return;

	let members = await message.guild.members.fetch();

	try {
		await members.forEach(async (member) => {
			try {
				await db.delete(`account.${member.id}.goldenBeans`);
			} catch (e) {
				console.log(e);
			}
		});
	} catch (e) {
		console.log(e);
		message.channel.send("ERRRROOR");
	}

	message.channel.send("DONE!");
};
