const Discord = require("discord.js");
const commandUsage = require("./../../utils/commandUsage.js");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("MANAGE_MESSAGES")) {
    return commandUsage.noPerms(message, "Manage Messages");
  }
  if (!args[0]) {
    return commandUsage.missingParams(message, "# of messages", "clear");
  }
  if (isNaN(args[0]))
    return message.channel
      .send("Please input a number")
      .then((msg) => commandUsage.deleteMsg(msg));

  // Messages are strings, we need to convert it to an int. to do math.
  const messagesToDelete = parseInt(args[0], 10) + 1;

  if (messagesToDelete >= 100) {
    return message.channel
      .send("The number has to be less than **99**!")
      .then((msg) => commandUsage.deleteMsg(msg));
  }
  if (messagesToDelete <= 1)
    return message.channel
      .send("Please insert a number greater than 1")
      .then((msg) => commandUsage.deleteMsg(msg));

  message.channel.bulkDelete(messagesToDelete).then((messages) =>
    message.channel
      .send({
        embed: {
          color: 0xff9f01,
          description: `Deleted \`${messages.size - 1}/${args[0]}\` messages.`,
        },
      })
      .then((msg) => commandUsage.deleteMsg(msg))
  );
};

exports.help = {
  name: "clear",
  description: "Clears an amount of messages",
  usage: "clear <amount>",
  example: "clear 15",
};

exports.conf = {
  aliases: ["delete", "purge", "clean"],
  cooldown: 5,
};
