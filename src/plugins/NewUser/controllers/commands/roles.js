const { newUserRoles } = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "roles",
  description: "Displays all the roles that will be given to any user that joins the server.",
  usage: "roles",
  example: "roles",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let { guild, channel } = message;
  let roles = newUserRoles.getRoles(guild.id) || [];

  channel.sendEmbed({
    author: { name: "Roles that will be given to new users:" },
    color: 0xff9f01,
    description: roles.map((r) => `<@&${r}>`),
  });
};
