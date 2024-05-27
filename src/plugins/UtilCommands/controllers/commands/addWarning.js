const { Warning, User } = require("./../../../../../api/models/index.js");

exports.help = {
  name: "addWarning",
  description: "Creates a custom thread invite.",
  usage: "addThreadCustomInvite <id> <emoji>",
  example: "addThreadCustomInvite 815606090183606323 👍",
};

exports.conf = {
  aliases: ["addcustom"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["UserID", "Reason"],
};

exports.run = async (client, message, args) => {
  let userId = args[0];
  let reason = args[1];
  let userInDb = User.findByPk(userId);
  if (!userInDb) await User.create({ userId: userId });
  Warning.create({ userId: userId, reason: reason, createdBy: message.author.id });
  message.channel.send("Warning should have been created!");
};
