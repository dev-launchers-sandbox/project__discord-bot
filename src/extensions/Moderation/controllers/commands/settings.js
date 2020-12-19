const Discord = require("discord.js");
const db = require("quick.db");
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

exports.run = async (client, message, args) => {
  const settings = [
    "prefix",
    "welcome",
    "audit",
    "total",
    "instanced-category",
    "invite",
    "moderator",
    "mod-cooldown",
    "directory",
    "teams",
    "ticket",
    "ticket-category",
    "admin",
    "minecraft",
    "minecraft-role",
    "minecraft-channel",
  ];


  let successEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`There has been a change in ${args[0]}`)
    .setDescription(`It got deleted or changed to: ${args[1]} `)
    .setTimestamp();

  let allSettingsEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle(`Settings for ${message.guild.name}`)
    .setFooter(
      "Use settings [name] [value] to set a value | Use delete to delete it"
    );

  allSettingsEmbed.addField(
    `Settings`,
    settings.map((x) => `\`${x}\``).join(" | ")
  );

  if (!args[0]) return message.channel.send(allSettingsEmbed);
  if (!settings.includes(args[0])) {
    return message.channel.send(allSettingsEmbed);
  }
  if (!args[1]) {
    const currentValue = await db.get(`${args[0]}.${message.guild.id}`);
    return message.channel.send(
      `The current value of **${args[0]}** is **${currentValue || "null!"} **`
    );
  }

  if (args[1] === "delete" || args[1] === "disable" || args[1] === "default") {
    try {
      await db.delete(`${args[0]}.${message.guild.id}`);
      return message.channel.send(successEmbed);
    } catch (error) {
      console.log(error);
      return await commandUsage.error(message, "settings");
    }
  }
  try {
    db.set(`${args[0]}.${message.guild.id}`, args[1]);
    message.channel.send(successEmbed);
  } catch (error) {
    return commandUsage.error(message, "settings");
  }
};
