const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

module.exports.help = {
  name: "removeInvite",
  description: "Removes an invite from the db.",
  usage: "removeInvite [name OR code]",
  example: "removeInvite website OR .removeInvite EAZfGWvN83",
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Name OR Code"],
};

module.exports.run = async (client, message, args) => {
  let toRemove = args[0];
  let invites = dbh.invite.getInvites(message.guild.id);

  if (toRemove in invites) {
    let code = dbh.invite.getInvite(message.guild.id, toRemove);
    dbh.invite.removeInvite(message.guild.id, toRemove);
    sendSuccessEmbed(message.channel, toRemove, code);
  }

  let nameOfCode = null;

  Object.keys(invites).forEach((name) => {
    let invite = dbh.invite.getInvite(message.guild.id, name);
    if (invite === toRemove) nameOfCode = name;
    return;
  });

  if (!nameOfCode) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      author: { name: "Invite Not Found" },
      description: `We searched across all our data, and we failed to find anything related with **${toRemove}**`,
    });
    return;
  }

  dbh.invite.removeInvite(message.guild.id, nameOfCode);
  sendSuccessEmbed(message.channel, nameOfCode, toRemove);
};

function sendSuccessEmbed(channel, name, code) {
  channel.sendEmbed({
    color: 0xff9f01,
    author: { name: "Invite removed" },
    description: `The code: **${code}** and the name: **${name}** have been removed`,
  });
}
