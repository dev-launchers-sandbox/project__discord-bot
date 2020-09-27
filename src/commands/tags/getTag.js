const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  const tag = args[0];
  if (!tag) return;
  const data = await db.get(`tag.${message.guild.id}.${tag}`);

  let messageNum = 1;
  if (!data) return message.channel.send("NO data");
  data.forEach(async (taggedMessage) => {
    const author = message.guild.members.resolve(taggedMessage.author);
    const embed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setAuthor(
        `Message by ${author.user.username}`,
        author.user.displayAvatarURL({ size: 2048 })
      )
      .setDescription(`Content:\n${taggedMessage.content}`)
      .setFooter(`Tag ${tag} Number ${messageNum}`);
    await message.channel.send(embed);
    messageNum += 1;
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
