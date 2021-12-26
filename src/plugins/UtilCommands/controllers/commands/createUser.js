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
  let userInDb = await User.findOne({ where: { discordId: userId } });

  if (userInDb) {
    message.channel.send("User already exists");
    return;
  }
  const ul = await User.create({ discordId: userId });
  console.log(ul);
  message.channel.send("Created user");
};
