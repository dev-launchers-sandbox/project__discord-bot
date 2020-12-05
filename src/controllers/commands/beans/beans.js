const Discord = require("discord.js");
const db = require("quick.db");
const getMessageTarget = require("../../../utils/getMessageTarget");

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.guild.members.resolve(message.author.id);
  // if the user is a bot, call it out
  if (target.bot) {
    return message.channel.send(
      "Bots do not have a balance. They will **always have infinite beans.**"
    );
  }
  let goldenBeanEmoji = message.guild.emojis.cache.find(
    (emoji) => emoji.name === "GoldenBean"
  );
  let devBeanEmoji = message.guild.emojis.cache.find(
    (emoji) => emoji.name === "DevBean"
  );
  // access user specific balance
  const data = getUserData(target);
  // format balance output message
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(`${target.user.username}’s Beans Balance`, data.avatar)
    .addField("Dev-Beans", `${data.devBeans} Dev Bean(s) ${devBeanEmoji}`)
    .addField(
      "Golden-Beans",
      `${data.goldenBeans} Golden Bean(s) ${goldenBeanEmoji}`
    )
    .setFooter(
      `All-time Dev Beans: ${data.foreverDevBeans} | All-time Golden Beans: ${data.foreverGoldenBeans}`
    );
  message.channel.send(embed);
};

function getUserData(target) {
  let foreverDevBeans = db.get(`account.${target.user.id}.foreverDevBeans`);
  let foreverGoldenBeans = db.get(
    `account.${target.user.id}.foreverGoldenBeans`
  );

  let devBeans = db.get(`account.${target.user.id}.devBeans`);
  let goldenBeans = db.get(`account.${target.user.id}.goldenBeans`);
  let avatar = target.user.avatarURL({ size: 2048 }); //target avatar

  if (!devBeans) devBeans = 0; // if there is no balance object, set to 0
  if (!goldenBeans) goldenBeans = 0;
  if (!foreverDevBeans) foreverDevBeans = 0;
  if (!foreverGoldenBeans) foreverGoldenBeans = 0;

  return {
    devBeans: devBeans,
    goldenBeans: goldenBeans,
    foreverDevBeans: foreverDevBeans,
    foreverGoldenBeans: foreverGoldenBeans,
  };
}
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
