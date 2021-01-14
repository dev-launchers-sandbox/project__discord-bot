const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "getInvites",
  description: "Shows you a list of all the invites associated with a keyword.",
  usage: "getInvites",
  example: "getInvites",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: [],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let invites = dbh.invite.getInvites(message.guild.id);

  let description = "None found";
  Object.keys(invites).forEach((name) => {
    if (description === "None found") description = "";
    let code = dbh.invite.getInvite(message.guild.id, name);
    description = description.concat(`\nInvite **${code}** --> **${name}**`);
  });

  if (description.length > 2048) {
    message.channel.send(
      "Time for an upgrade! You have too many invites for me to display!"
    );
    return;
  }

  channel.sendEmbed({
    color: 0xff9f01,
    author: { name: "Invites:" },
    description: description,
  });
};
