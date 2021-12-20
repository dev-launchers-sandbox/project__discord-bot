const Discord = require("discord.js");

const CommandHandler = require("./../../../.common/structures/CommandHandler/CommandHandler.js");

exports.help = {
  name: "help",
  description: "Show information about commands",
  usage: "help [command]",
  example: "help info",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let prefix = db.get(`prefix.${message.guild.id}`) || ".";
  if (!args[0]) {
    let module = client.helps.array();

    if (!client.config.owners.includes(message.author.id)) {
      module = client.helps.array().filter((x) => !x.hide);
    }

    module = client.helps.array().filter((cat) => {
      let cmdHandler = new CommandHandler(null, message, args);
      return cmdHandler.validateCategory(cat.permissions);
    });

    module.sort((a, b) => a.helpPage - b.helpPage);
    let fields = [];
    for (const mod of module) {
      fields.push({
        name: mod.name,
        value: mod.cmds.map((x) => `\`${x}\``).join(" | "),
      });
    }

    return message.channel.sendEmbed({
      color: 0xff9f01,
      timestamp: true,
      description: `Type \`${prefix}help [command]\` to get a more specific information about a command!`,
      fields: fields,
    });
  } else {
    let cmd = args[0].toLowerCase();
    if (
      client.commands.has(cmd) ||
      client.commands.get(client.aliases.get(cmd))
    ) {
      let command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
      let name = command.help.name;
      let description = command.help.description;
      let cooldown = command.conf.cooldown + " second(s)";
      let aliases = command.conf.aliases.join(", ")
        ? command.conf.aliases.join(", ")
        : "None";
      let usage = command.help.usage ? command.help.usage : "None";
      let example = command.help.example ? command.help.example : "None";

      return message.channel.sendEmbed({
        color: 0xff9f01,
        thumbnail: client.user.displayAvatarURL(),
        title: name,
        description: description,
        fields: [
          { name: "Cooldown", value: cooldown, inline: true },
          { name: "Aliases", value: aliases, inline: true },
          { name: "Usage", value: usage, inline: true },
          { name: "Example", value: prefix + example, inline: true },
        ],
      });
    } else {
      return message.channel.sendEmbed({
        color: "RED",
        description: "Unknown Command",
      });
    }
  }
};
