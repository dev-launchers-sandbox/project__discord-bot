const currencyManager = require("./../../structures/CurrencyManager.js");
const getMessageTarget = require("../../../../utils/getMessageTarget");

exports.help = {
  name: "addCoins",
  description: "Add an amount of coins to a user",
  usage: "addCoins [user] <amount>",
  example: "addCoins @Guillermo#0000 10",
};

exports.conf = {
  permissions: ["ADMINISTRATOR"],
  arguments: ["User"],
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.author;

  let amount = target === message.author ? args[0] : args[1];
  if (isNaN(amount)) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: "You must pass a number",
    });
    return;
  }

  currencyManager.addCoins(target.id, amount);
};
