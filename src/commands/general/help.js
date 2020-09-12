const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let prefix = db.get(`prefix.${message.guild.id}`) || ".";
  if (!args[0]) {
    let module = client.helps.array();

    if (!client.config.owners.includes(message.author.id)) {
      module = client.helps.array().filter((x) => !x.hide);
    }
    const embed = new Discord.MessageEmbed()
      .setColor("0xff9f01")
      .setTimestamp(new Date())
      .setDescription(
        `Type \`${prefix}help [command]\` to get a more specific information about a command!`
      )
      .setTitle("DevLaunchers Bot");

    for (const mod of module) {
      embed.addField(
        `${mod.name}`,
        mod.cmds.map((x) => `\`${x}\``).join(" | ")
      );
    }

    return message.channel.send(embed);
  } else {
    let cmd = args[0];
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

      let embed = new Discord.MessageEmbed()
        .setColor("0xff9f01")
        .setTitle(name)
        .setDescription(description)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter("DevLaunchers Bot | https://devlaunchers.com")
        .addField("Cooldown", cooldown, true)
        .addField("Aliases", aliases, true)
        .addField("Usage", usage, true)
        .addField("Example", example, true);

      return message.channel.send(embed);
    } else {
      return message.channel.send({
        embed: { color: "RED", description: "Unknown Command" },
      });
    }
  }
};

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
