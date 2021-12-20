const Discord = require("discord.js");

const commandUsage = require("../../../../utils/commandUsage.js");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

exports.help = {
  name: "settings",
  description: "Change the settings for the server",
  usage: "settings [type] [value]",
  example: "settings prefix !",
};

exports.conf = {
  aliases: ["setting"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

const settings = [
  "prefix",
  "welcome",
  "audit",
  "total",
  "introductions-channel",
  "threads-category",
  "invite",
  "moderator",
  "mod-cooldown",
  "directory-channel",
  "teams",
  "ticket",
  "ticket-category",
  "admin",
  "minecraft",
  "minecraft-role",
  "minecraft-channel",
  "control-center",
  "thread-inactivity-time",
  "moderation-server",
  "minecraft-event",
  "dev-bean-emoji",
  "golden-bean-emoji",
];

exports.run = async (client, message, args) => {
  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`There has been a change in ${args[0]}`)
    .setDescription(`It got deleted or changed to: ${args[1]} `)
    .setTimestamp();

  if (!args[0] || !settings.includes(args[0])) {
    sendBasicEmbed(message.channel, message.guild.name);
    return;
  }

  if (!args[1]) {
    const currentValue = db.get(`${args[0]}.${message.guild.id}`);
    message.channel.send(`The current value of **${args[0]}** is **${currentValue || "null!"} **`);
    return;
  }

  if (args[1] === "delete" || args[1] === "disable" || args[1] === "default") {
    try {
      await db.delete(`${args[0]}.${message.guild.id}`);
      sendSuccessEmbed(message.channel, args);
      return;
    } catch (error) {
      console.log(error);
      return await commandUsage.error(message, "settings");
    }
  }
  try {
    db.set(`${args[0]}.${message.guild.id}`, args[1]);
    sendSuccessEmbed(message.channel, args);
  } catch (error) {
    return commandUsage.error(message, "settings");
  }
};

function sendBasicEmbed(channel, guildName) {
  channel.sendEmbed({
    color: 0xff9f01,
    title: `Settings for ${guildName}`,
    footer: "Use settings [name] [value] to set a value | Use delete to delete it",
    fields: [{ name: "Settings", value: settings.map((x) => `\`${x}\``).join(" | ") }],
  });
}

function sendSuccessEmbed(channel, args) {
  channel.sendEmbed({
    embed: "GREEN",
    author: { name: `There has been a change in ${args[0]}` },
    description: `It got deleted or changed to: ${args[1]}`,
    timestamp: true,
  });
}
