const { newUserRoles } = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "addRole",
  description: "Adds a role to the list that will be given to any new user that joins the server.",
  usage: "addRole <roleId>",
  example: "addRole 696048684529483856",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: ["RoleId"],
};

exports.run = async (client, message, args) => {
  let roleId = args[0];

  if (!message.guild.roles.cache.find((r) => r.id === roleId)) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `The role with an id of ${roleId} is not in the server.`,
    });
    return;
  }

  if (newUserRoles.addRole(message.guild.id, roleId)) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `<@&${roleId}> will now be given to every new user.`,
    });
  } else {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `<@&${roleId} is already being given to every new user.`,
    });
  }
};
