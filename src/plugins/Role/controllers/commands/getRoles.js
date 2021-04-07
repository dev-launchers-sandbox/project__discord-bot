const Discord = require("discord.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

const RoleManager = require("../../structures/RoleManager.js");

exports.help = {
  name: "getRoles",
  description: "Get roles you can add to yourself with .iam",
  usage: "getroles",
  example: "getroles",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let roleManager = new RoleManager();
  let channel = message.channel;
  let user = message.author;

  channel.sendEmbed({
    color: 0xff9f01,
    title:
      "👥 Possible roles: \n       - *" +
      roleManager.getPossibleRoles().join("*\n       - *") +
      "*",
    footer: "use '.iam roleName' to give yourself roles from this list!",
  });
};
