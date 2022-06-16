const Discord = require("discord.js"),
  cooldowns = new Discord.Collection();
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");
const metrics = require("../../index.js");
const CommandHandler = require("./../../plugins/.common/structures/CommandHandler/CommandHandler.js");

module.exports = async (client, message) => {
  // Right now, intervals won't be started until "!d bump" is typed at least once
  this.bumpInterval = -1; // used to track bump intervals

  if (!message.guild) return;
  let prefix = db.get(`prefix.${message.guild.id}`) || ".";
  const args = message.content.slice(prefix.length).trim().split(" ");

  if (message.author.id === "302050872383242240") bumpCheck(message);
  if (message.author.id === "159985870458322944") newLevelCheck(message, args);

  let inviteLink = ["discord.gg", "discord.com/invite", "discordapp.com/invite"];

  if (inviteLink.some((word) => message.content.toLowerCase().includes(word))) {
    let teamsChannel = db.get(`teams.${message.guild.id}`) || "None";
    if (message.channel.id === teamsChannel) return;
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    message
      .delete()
      .then(
        message.channel.send(
          `**${message.author.username}** you cannot promote your server here! You can only promote it in the teams and projects channel __if it is related to a project__`
        )
      )
      .then((msg) => commandUsage.deleteMsg(msg));
  }

  moderateInstancedChannels(client, message);

  if (message.content.startsWith(`<@!${client.user.id}>`) && message.content.length === 22) {
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
        .then((msg) => commandUsage.deleteMsg(msg));
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

function moderateInstancedChannels(client, message) {
  let instancedChannels = db.get(`instanced.${message.guild.id}`);
  let instancedChannel;
  if (Array.isArray(instancedChannels)) {
    instancedChannel = instancedChannels.find((channel) => channel.newChannel === message.channel.id);
  }
  if (!instancedChannel) return;

  let moderationChannel = client.channels.resolve(instancedChannel.channelForModeration.id);

  if (!moderationChannel) return;
  let messageData =
    "`" +
    "Author:" +
    "` " +
    `<@${message.author.id}>` +
    "\n`" +
    "Message Content:" +
    "`" +
    ` ${message.content}` +
    "\n------------------------------------------";

  moderationChannel.send(messageData);
}

function scheduleBumpReminderInterval(message) {
  clearInterval(this.bumpInterval);
  this.bumpInterval = setInterval(() => {
    message.channel.sendEmbed({
      color: 0xff9f01,
      title: "🤜🤛 Help grow the community! Run */bump'* to elevate our server on Disboard!",
    });
  }, 1000 * 60 * 60 * 2 + 1000 * 60 * 5); // 2 hours + five minutes
}
function bumpCheck(message) {
  const embed = message.embeds[0];
  if (!embed) return;
  if (!embed.image) return;
  if (embed.image.url === "https://disboard.org/images/bot-command-image-bump.png") {
    // New code to send reminders about bumps, instead of giving beans
    scheduleBumpReminderInterval(message);
  }
}

function getRandomBeans() {
  const num = Math.random();

  if (num <= 0.9) return { type: "devBeans", value: 1 };
  else if (num <= 0.95) return { type: "devBeans", value: 2 };
  else if (num <= 0.98) return { type: "devBeans", value: 3 };
  else return { type: "goldenBeans", value: 1 };
}

function getEmote(guild, type) {
  type = type.substring(0, type.length - 1);
  type = type.charAt(0).toUpperCase() + type.slice(1);
  const emote = guild.emojis.cache.find((emoji) => emoji.name === type);

  return emote || type;
}

async function newLevelCheck(message, args) {
  if (!args.includes("advanced")) return;

  const user = message.mentions.members.first();
  const lvl = args[4];
  const levels = ["1", "2", "5", "10", "15", "20", "25", "30", "35", "40"];
  if (!levels.includes(lvl)) return;

  const index = levels.indexOf(lvl);
  user.roles.add(getRoleLevel(message, lvl));

  for (let i = index - 1; i !== -1; i--) {
    const role = getRoleLevel(message, levels[i]);
    if (user.roles.cache.has(role.id)) {
      user.roles.remove(role.id);
    }
  }
}

function getRoleLevel(message, lvl) {
  let wordNum;
  if (lvl === "1") wordNum = "one";
  else if (lvl === "2") wordNum = "two";
  else if (lvl === "5") wordNum = "five";
  else if (lvl === "10") wordNum = "ten";
  else if (lvl === "15") wordNum = "fifteen";
  else if (lvl === "20") wordNum = "twenty";
  else if (lvl === "25") wordNum = "twenty-five";
  else if (lvl === "30") wordNum = "thirty";
  else if (lvl === "35") wordNum = "thirty-five";
  else wordNum = "forty";

  const role = message.guild.roles.resolve(db.get(`levels.${message.guild.id}.${wordNum}`));

  return role;
}
