const { User } = require("./../../../../../api/models/index.js");

exports.help = {
  name: "createUser",
  description: "Creates a custom thread invite.",
  usage: "addThreadCustomInvite <id> <emoji>",
  example: "addThreadCustomInvite 815606090183606323 👍",
};

exports.conf = {
  aliases: ["addcustom"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["UserID"],
};

exports.run = async (client, message, args) => {
  let userId = args[0];
  let userInDb = await User.findByPk(userId);
  if (userInDb) {
    message.channel.send("User already exists");
    return;
  }
  await User.create({ id: userId });
  message.channel.send("Created user");
};
