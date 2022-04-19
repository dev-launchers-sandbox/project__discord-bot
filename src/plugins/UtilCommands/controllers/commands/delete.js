const { Guild, Channel } = require("./../../../../../api/models/index.js");

exports.help = {
  name: "delete",
  description: "Creates a custom thread invite.",
  usage: "addThreadCustomInvite <id> <emoji>",
  example: "addThreadCustomInvite 815606090183606323 👍",
};

exports.conf = {
  aliases: ["addcustom"],
  cooldown: 5,
};
exports.run = async (client, message, args) => {
  Channel.sync({ force: true });
  Guild.sync({ force: true });
};
