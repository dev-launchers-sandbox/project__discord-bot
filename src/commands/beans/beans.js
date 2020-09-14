const Discord = require("discord.js");
const db = require("quick.db");
const getMessageTarget = require("../../utils/getMessageTarget");

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.guild.members.resolve(message.author.id);
  // if the user is a bot, call it out
  if (target.bot) {
    return message.channel.send(
      "Bots do not have a balance. They will **always have infinite beans.**"
    );
  }
  // access user specific balance
  let devBeans = db.get(`account.${target.user.id}.devBeans`);
  let avatar = target.user.avatarURL({ size: 2048 }); //target avatar
  let devBeanEmoji = message.guild.emojis.cache.find(
    (emoji) => emoji.name === "DevBean"
  );
  let goldenBeanEmoji = message.guild.emojis.cache.find(
    (emoji) => emoji.name === "GoldenBean"
  );
  if (!devBeans) devBeans = 0; // if there is no balance object, set to 0
  let goldenBeans = db.get(`account.${target.user.id}.goldenBeans`);
  if (!goldenBeans) goldenBeans = 0;
  // format balance output message
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(`${target.user.tag} DevBeans Balance`, avatar)
    .addField("Dev-Beans", `${devBeans} Dev Bean(s) ${devBeanEmoji}`)
    .addField(
      "Golden-Beans",
      `${goldenBeans} Golden Bean(s) ${goldenBeanEmoji}`
    )
    .setTimestamp(new Date());
  message.channel.send(embed);
};

exports.help = {
  name: "beans",
  description: "Shows your beans",
  usage: `beans [@user]`,
  example: `beans`,
};

exports.conf = {
  aliases: ["getbeans", "bal", "balance"],
  cooldown: 5,
};
