const { User, Warning } = require("./../../../../../api/models/index.js");

exports.help = {
  name: "getWarnings",
  description: "Creates a custom thread invite.",
  usage: "addThreadCustomInvite <id> <emoji>",
  example: "addThreadCustomInvite 815606090183606323 👍",
};

exports.conf = {
  aliases: ["addcustom"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: [],
};

exports.run = async (client, message, args) => {
  const warnings = await Warning.findAll({ where: { userId: message.author.id } });
  console.log(warnings);
};
