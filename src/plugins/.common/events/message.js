const Discord = require("discord.js"),
  cooldowns = new Discord.Collection();
const metrics = require("./../../../index.js");
const CommandHandler = require("./../structures/CommandHandler/CommandHandler.js");

exports.eventHandle = "message";
exports.event = async (client, message) => {
  if (!message.guild) return;
  const prefix = "?";
  const args = message.content.slice(prefix.length).trim().split(" ");

  if (message.content === `<@!${client.user.id}>`) {
    return message.channel.send(`My prefix is **${prefix}**`);
  }

  if (message.author.bot || message.author === client.user) return;

  if (!message.content.startsWith(prefix)) return;

  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return console.log("command not found");

  if (!cooldowns.has(commandFile.help.name))
    cooldowns.set(commandFile.help.name, new Discord.Collection());

  const member = message.member,
    now = Date.now(),
    timestamps = cooldowns.get(commandFile.help.name),
    cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

  if (!commandFile) return;
  let commandHandler = new CommandHandler(commandFile.help.name, message, args);

  if (
    !commandHandler.validateCommand({
      permissions: commandFile.conf.permissions || [],
      arguments: commandFile.conf.arguments || [],
    })
  )
    return;

  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      try {
        message.delete();
      } catch {
        console.log("ERROR IN DELETING MESSAGE --> message.js");
      }
      return message.channel
        .send(`You need to wait **${timeLeft.toFixed(1)}** seconds to use this command again!`)
        .then((msg) => {
          console.log("Removed for simplicity");
        });
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
  }

  try {
    metrics.sendEvent("message_" + commandFile.help.name);
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error);
  }
};
