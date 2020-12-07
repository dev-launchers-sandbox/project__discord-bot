const Discord = require("discord.js"),
  fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.helps = new Discord.Collection();

  // Old commands
  const commandsFolder = path.join(__dirname, "../controllers/commands/");
  fs.readdir(commandsFolder, (err, categories) => {
    if (err) console.log(err);
    console.log(`Found total ${categories.length} categories`);

    categories.forEach((category) => {
      let moduleConf = require(`../controllers/commands/${category}/module.json`);
      moduleConf.path = `./controllers/commands/${category}`;
      moduleConf.cmds = [];

      if (!moduleConf) return;

      client.helps.set(category, moduleConf);

      const categoryFolder = path.join(
        __dirname,
        `../controllers/commands/${category}`
      );
      fs.readdir(categoryFolder, (err, files) => {
        console.log(
          `Found total ${files.length - 1} command(s) from ${category}`
        );
        if (err) console.log(err);
        let commands = new Array();

        files.forEach((file) => {
          if (!file.endsWith(".js")) return;
          let prop = require(`../controllers/commands/${category}/${file}`);
          let cmdName = file.split(".")[0];

          client.commands.set(prop.help.name, prop);

          prop.conf.aliases.forEach((alias) => {
            client.aliases.set(alias, prop.help.name);
          });
          client.helps.get(category).cmds.push(prop.help.name);
        });
      });
    });
  });

  // New commands
  // TODO: Change the strategy for accessing commands from reading file names (old process) to using the index.js structures
  const extensions = require("../extensions");
  for (let extension of extensions) {
    const category = extension.name;

    console.log("CATEGORY: " + category);

    let moduleConf = {
      name: extension.helpCategory,
      hide: false,
      path: `./extensions/${extension.name}/controllers/commands`,
      cmds: [],
    };

    const categoryFolder = `./src/extensions/${extension.name}/controllers/commands`;
    console.log("CATEGORY_FOLDER: " + categoryFolder);
    fs.readdir(categoryFolder, (err, files) => {
      console.log(err);
      if (!files) return;
      console.log(`FOUND TOTAL ${files.length} command(s) from ${category}`);
      if (err) console.log(err);

      if (files.length > 0) {
        client.helps.set(category, moduleConf);
        let commands = new Array();

        files.forEach((file) => {
          if (!file.endsWith(".js")) return;

          let prop = require(`../extensions/${extension.name}/controllers/commands/${file}`);
          let cmdName = file.split(".")[0];

          client.commands.set(prop.help.name, prop);

          prop.conf.aliases.forEach((alias) => {
            client.aliases.set(alias, prop.help.name);
          });
          client.helps.get(category).cmds.push(prop.help.name);
        });
      }
    });
  }
};
