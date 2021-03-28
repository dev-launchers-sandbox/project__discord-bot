const Discord = require("discord.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

const RoleManager = require("../../structures/RoleManager.js");

exports.help = {
  name: "iamnot",
  description: "Remove roles from yourself!",
  usage: "iamnot ROLE NAME",
  example: "iamnot Coding Helper",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let roleManager = new RoleManager();
  let channel = message.channel;
  let user = message.author;

  let roleName = args.slice(0).join(" ");

  // Make sure this is an allowed role
  let role = roleManager.getRoleFromName(message.guild, roleName);
  if (!role) {
    channel.sendEmbed({
      color: 0xff9f01,
      title: "Role not found!",
    });
    return;
  }

  const member = message.guild.members.cache.get(user.id);
  if (!member) {
    channel.sendEmbed({
      color: 0xff9f01,
      title: "Member not found!",
    });
    return;
  }

  await member.roles.remove(role.id).catch((e) => console.log(e));

  channel.sendEmbed({
    color: 0xff9f01,
    title: "👥 The role (" + roleName + ") has been removed!",
  });
};
