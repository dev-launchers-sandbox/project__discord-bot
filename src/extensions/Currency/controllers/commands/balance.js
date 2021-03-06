const CurrencyManager = require("./../../structures/CurrencyManager.js");
const getMessageTarget = require("../../../../utils/getMessageTarget");

exports.help = {
  name: "balance",
  description: "Get's the balance of a user",
  usage: "balance [user] ",
  example: "balance",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.member;

  let balance = CurrencyManager.getCoins(target.id) || 0;

  message.channel.sendEmbed({
    color: 0xff9f01,
    author: {
      name: `${target.user.tag}'s balance`,
      image: target.user.avatarURL(),
    },
    fields: [{ name: `Coins`, value: `${balance} coins ` }],
  });
};
