const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");
const getMessageTarget = require("../../utils/getMessageTarget.js");

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
    "tags",
  ];
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return commandUsage.noPerms(message, "Administrator");

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
  if (args[0] === "tag" || args[0] === "tags")
    return tagSettings(message, args);
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

async function tagSettings(message, args) {
  const privateTags = await db.get(`privateTags.${message.guild.id}`);
  if (!args[1]) {
    if (!privateTags)
      return message.channel.send(`The private tags are: **null**`);
    const content = privateTags.map((x) => `\`${x}\``).join(" | ");
    return message.channel.send(
      `The private tags are: ${content || "**none**"}`
    );
  }
  if (!args[2] && args[1] !== "remove-all")
    return message.channel.send("You need to type a tag to add or remove");
  if (args[1] === "add") {
    if (privateTags && privateTags.includes(args[2])) {
      return message.channel.send("That already is a private tag!");
    }
    await db.push(`privateTags.${message.guild.id}`, args[2]);
    message.channel.send(`👍 I added ${args[2]} as a private tag`);
  } else if (args[1] === "remove" || args[1] === "delete") {
    if (!privateTags) return message.channel.send("Tag not found!");
    const index = privateTags.indexOf(args[2]);
    if (index < 0) return message.channel.send("Tag not found!");

    privateTags.splice(index, 1);
    await db.set(`privateTags.${message.guild.id}`, privateTags);
    message.channel.send(`👍 I removed ${args[2]} as a private tag`);
  } else if (args[1] === "remove-all") {
    await db.delete(`privateTags.${message.guild.id}`);
    message.channel.send("👍 Done");
  }
}

exports.help = {
  name: "settings",
  description: "Change the settings for the server",
  usage: "settings [type] [value]",
  example: "settings prefix !",
};

exports.conf = {
  aliases: ["setting"],
  cooldown: 5,
};
