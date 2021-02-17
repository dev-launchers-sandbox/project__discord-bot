const config = require("../../../../config.json");
module.exports.help = {
	name: "",
	description: "",
	usage: "",
	example: "",
};

module.exports.conf = {
	aliases: ["e"],
	cooldown: 0,
};

module.exports.run = async (client, message, args) => {
	if (!config.contributors.includes(message.author.id)) return;
	if (!message.guild.id === "711687367081328752") return;

	try {
		const code = args.join(" ");
		let evaled = eval(code);

		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

		message.channel.send(clean(evaled), { code: "xl" });
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
};
