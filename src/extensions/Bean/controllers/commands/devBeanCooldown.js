const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "devbean",
  description: "Shows someone’s Dev Bean cooldown!",
  usage: `devbean [@user]`,
  example: `devbean`,
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
};

module.exports.run = async (client, message, args) => {
  const cooldown = 60000;

  // Changes the number to a string and adds a 0 at the beggining of numbers lower than 0.
  let pad_zero = (num) => (num < 10 ? "0" : "") + num;
  let timeObj;

  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.member;

  const isAuthorTarget = message.author.id === target.id;
  const lastDevBean = db.get(`lastDevBean.${target.id}`);

  if (lastDevBean !== null && cooldown - (Date.now() - lastDevBean) > 0) {
    timeObj = ms(cooldown - (Date.now() - lastDevBean));
    let seconds = pad_zero(timeObj.seconds).padStart(2, "");
    let finalTime = `**${seconds} second(s)**`;

    message.channel.send(
      (isAuthorTarget ? "You need " : target.user.username + " needs ") +
        `to wait **${finalTime}**`
    );
    return;
  } else {
    message.channel.send(
      (isAuthorTarget ? "You have " : target.user.username + " has ") +
        "**no cooldown**"
    );
  }
};
