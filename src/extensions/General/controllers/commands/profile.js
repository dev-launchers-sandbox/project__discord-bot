const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const currencyManager = require("./../../../Currency/structures/CurrencyManager.js");
const getMessageTarget = require("../../../../utils/getMessageTarget");

exports.help = {
  name: "profile",
  description: "Displays ",
  usage: "ping",
  example: "ping",
};

exports.conf = {
  aliases: ["latency", "api", "response"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let guild = message.guild;
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.member;

  let coins = currencyManager.getCoins(target.id) || 0;

  let coinEmoji = guild.emojis.cache.find((e) => e.name === "money") || "$";
  let devBeanEmoji = guild.emojis.resolve(dbh.bean.getDevBeanEmojiId(guild.id)) || "Dev Beans";
  let goldenBeanEmoji = guild.emojis.resolve(dbh.bean.getGoldenBeanEmojiId(guild.id)) || "Golden Beans";

  let foreverDevBeans = dbh.bean.getUserForeverDevBeans(target.id) || 0;
  let foreverGoldenBeans = dbh.bean.getUserForeverGoldenBeans(target.id) || 0;
  let devBeans = dbh.bean.getUserDevBeans(target.id) || 0;
  let goldenBeans = dbh.bean.getUserGoldenBeans(target.id) || 0;

  channel.sendEmbed({
    color: 0xff9f01,
    author: { name: `${target.user.tag}'s profile`, image: target.user.displayAvatarURL() },
    fields: [
      { name: "Dev Beans", value: `${devBeans} ${devBeanEmoji}`},
      { name: "Golden Beans", value: `${goldenBeans} ${goldenBeanEmoji}`},
      { name: `Coins`, value: `${coins} ${coinEmoji}` },
    ],
    //thumbnail: target.user.displayAvatarURL(),
    footer: `All-time Dev Beans: ${foreverDevBeans} | All-time Golden Beans: ${foreverGoldenBeans}`,
  });
};
