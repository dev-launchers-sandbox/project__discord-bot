const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

module.exports.help = {
  name: "addInvite",
  description: "Adds a keyword to an invite.",
  usage: "addInvite [name] [code]",
  example: "addInvite website EAZfGWvN83",
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Name", "Code"],
};

module.exports.run = async (client, message, args) => {
  let name = args[0].toLowerCase();
  let code = args[1];

  dbh.invite.setInvite(message.guild.id, name, code);

  message.channel.sendEmbed({
    color: 0xff9f01,
    author: { name: `New Invite Added` },
    description: `Invite **${code}** now matches **${name}**`,
  });
};
