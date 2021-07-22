const { newUserRoles } = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "removeRole",
  description: "Removes a role to the list that will be given to any new user that joins the server.",
  usage: "removeRole <roleId>",
  example: "removeRole 696048684529483856",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: ["RoleId"],
};

exports.run = async (client, message, args) => {
  let roleId = args[0];
  if (newUserRoles.removeRole(message.guild.id, roleId)) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `🟢 The role with an id of ${roleId} has been removed`,
    });
  } else {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `A role with an id of ${roleId} was not found.`,
    });
  }
};
