const Discord = require("discord.js");
const commandUsage = require("../../../../utils/commandUsage.js");

module.exports.help = {
  name: "clear",
  description: "Clears an amount of messages",
  usage: "clear <amount> [@user]",
  example: "clear 15",
};

module.exports.conf = {
  aliases: ["delete", "purge", "clean"],
  cooldown: 5,
  permissions: ["MANAGE_MESSAGES"],
  arguments: ["# Of Messages To Delete"],
};

module.exports.run = async (client, message, args) => {
  if (!(await isValid(message, args))) return;

  const messagesToDelete = parseInt(args[0], 10) + 1;

  let messages = await message.channel.messages.fetch({
    limit: messagesToDelete,
  });

  if (message.mentions.users.first()) {
    const user = message.mentions.users.first().id;
    messages = messages.filter((msg) => msg.author.id === user);
  }

  if (!messages) return message.channel.send("No messages were found!");

  let lastMessage = messages
    .sort(({ createdTimestamp: a }, { createdTimestamp: b }) => a - b)
    .first();

  if (!lastMessage) return message.channel.send("No messages were found!");

  let msg = await message.channel.send(
    `The last message that will get deleted is:\n${lastMessage.url}\nIf you want to continue, type **y**, if not type **n**`
  );
  let didConfirm = getConfirmation(message, msg);

  if ((await didConfirm) && didConfirm !== "ranOut") {
    messages.forEach(async (msg) => {
      if (msg.deleted) return;
      await msg.delete().catch((err) => console.log(err));
    });
  } else if (!didConfirm) message.channel.send("Okay");
};

function isValid(message, args) {
  if (isNaN(args[0])) {
    return message.channel
      .send("Please input a number")
      .then((msg) => commandUsage.deleteMsg(msg));
  }
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

  return true;
}

async function getConfirmation(message, msg) {
  const filter = (response) => {
    return response.author === message.author;
  };
  let didConfirm = false;
  await message.channel
    .awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
    .then((collected) => {
      collected.forEach((c) => c.delete());
      didConfirm = didUserConfirm(collected.first().content);
      msg.delete();
    })
    .catch((collected) => {
      message.channel.send(
        "You took too long to answer! I have cancelled the process!"
      );
      return "ranOut";
    });

  function didUserConfirm(response) {
    const answer = response.toLowerCase();
    if (answer === "y" || answer === "yes") {
      return true;
    } else return false;
  }

  return didConfirm;
}
