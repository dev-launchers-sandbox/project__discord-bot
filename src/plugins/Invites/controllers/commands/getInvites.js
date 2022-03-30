const Discord = require("discord.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");
const inviteHandler = require("./../../structures/InviteHandler.js");

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
  let invites = await dbh.invite.getInvites(message.guild.id);

  let description = invites.length === 0 ? "None found" : "";

  for (const invite of invites) {
    const { name, code } = invite;
    const guildInvite = inviteHandler.getInvite(message.guild.id, code);

    description = description.concat(
      "\n",
      `\ Name: **${name}** | Code: **${code}** | Uses: **${guildInvite ? guildInvite.uses : 0}**`
    );
  }

  if (description.length > 2048) {
    message.channel.send("Time for an update! You have too many invites for me to display!");
    return;
  }

  channel.sendEmbed({
    color: 0xff9f01,
    author: { name: "Invites:" },
    description: description,
  });
};
