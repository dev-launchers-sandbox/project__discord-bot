const db = require("quick.db");

exports.help = {
  name: "endSeason",
  description: "Ends the current bean season",
  usage: `endSeason`,
  example: `endSeason`,
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

exports.run = async (client, message, args) => {
  const { channel } = message;
  const accounts = db.get("account");
  if (!accounts) return;

  let count = 0;
  Object.keys(accounts).forEach((userId) => {
    db.delete(`account.${userId}.devBeans`);
    db.delete(`account.${userId}.goldenBeans`);
    count++;
  });

  message.channel.send(`Deleted the beans of ${count} users`);
};
