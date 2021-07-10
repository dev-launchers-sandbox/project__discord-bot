const db = require("quick.db");

exports.help = {
  name: "endSeasonTwo",
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

  channel.send("Starting the process of ending the season.");
  let members = await message.guild.members.fetch();
  for (let member of members) {
    let memberId = member[0];
    db.delete(`account.${memberId}.devBeans`);
    db.delete(`account.${memberId}.goldenBeans`);
  }
};
