const Discord = require("discord.js"),
	fs = require("fs");
const path = require("path");

module.exports = (client) => {
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.helps = new Discord.Collection();

	const extensions = require("../extensions");
	for (let extension of extensions) {
		let category = extension.name;

		if (extension.commands.length > 0) {
			let moduleConf = {
				name: extension.helpCategory,
				helpPage: extension.helpPage,
				hide: false,
				path: `../extensions/${category}/controllers/commands`,
				cmds: [],
				permissions: extension.permissions,
			};

			client.helps.set(category, moduleConf);

			for (let command of extension.commands) {
				let name = command.help.name.toLowerCase();
				let aliases = command.conf.aliases;

				client.commands.set(name, command);

				aliases.forEach((alias) => {
					client.aliases.set(alias.toLowerCase(), name);
				});

				client.helps.get(category).cmds.push(name);
			}
		}
	}
};
