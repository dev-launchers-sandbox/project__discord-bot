const Discord = require("discord.js"),
  fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.helps = new Discord.Collection();

  const plugins = require("../plugins");
  for (let plugin of plugins) {
    let category = plugin.name;

    if (plugin.commands.length > 0) {
      let moduleConf = {
        name: plugin.helpCategory,
        helpPage: plugin.helpPage,
        hide: false,
        path: `../plugins/${category}/controllers/commands`,
        cmds: [],
        permissions: plugin.permissions,
      };

      client.helps.set(category, moduleConf);

      for (let command of plugin.commands) {
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
