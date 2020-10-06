const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");

exports.run = async (client, message, args) => {
  const tag = args[0];
  if (!tag) return commandUsage.missingParams(message, "Tag to see", "getTag");
  console.log(db.get("tag"));
  const data = await db.get(`tag.${message.guild.id}.${tag}`);
  if (!data)
    return message.channel.send(`There are no messages tagged with **${tag}**`);

  let messageNum = 1;

  message.react("📨");

  data.forEach(async (taggedMessage) => {
    const author = message.guild.members.resolve(taggedMessage.author);
    const embed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setAuthor(
        `Message by ${author.user.tag || "User Not Found"}`,
        author.user.displayAvatarURL({ size: 2048 })
      )
      .setDescription(`Content:\n${taggedMessage.content}`)
      .setFooter(`Tag ${tag} Number ${messageNum}`);
    messageNum = messageNum + 1;
    await message.author.send(embed);
  });
};

exports.help = {
  name: "gettag",
  description: "Kicks a member from an instanced channel",
  usage: "blacklist <@user>",
  example: "blacklist @Wumpus#0001",
};

exports.conf = {
  aliases: ["tag"],
  cooldown: 5,
};
