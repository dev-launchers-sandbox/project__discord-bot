const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "addInvite",
  description: "Adds a keyword to an invite.",
  usage: "addInvite [name] [code]",
  example: "addInvite website EAZfGWvN83",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Name", "Code"],
};

exports.run = async (client, message, args) => {
  let name = args[0].toLowerCase();
  let code = args[1];

  const res = await dbh.invite.setInvite(message.guild.id, name, code);

  message.channel.sendEmbed({
    color: 0xff9f01,
    author: { name: res ? `New Invite Added` : `Invite ${name} not found` },
    description: res ? `${name} is now linked with --> ${code}` : `No changes were made.`,
  });
};
