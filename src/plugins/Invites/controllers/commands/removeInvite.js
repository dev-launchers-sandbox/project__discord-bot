const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "removeInvite",
  description: "Removes an invite from the db.",
  usage: "removeInvite [name]",
  example: "removeInvite website ",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Name"],
};

exports.run = async (client, message, args) => {
  const deleted = await dbh.invite.removeInviteByName(message.guild.id, args[0]);
  message.channel.sendEmbed({
    color: "0xff9f01",
    description: deleted ? `Deleted ${args[0]}` : `Invite not found!`,
  });
};
