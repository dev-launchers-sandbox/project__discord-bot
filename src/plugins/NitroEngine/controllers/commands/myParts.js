const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");

const PartInventory = require("../../structures/PartInventory.js");

exports.help = {
  name: "myParts",
  description: "Get a list of your current Nitro Engine parts",
  usage: "myParts",
  example: "myParts",
};

exports.conf = {
  aliases: ["getParts"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let user = message.author;

  let partInventory = new PartInventory(dbh, client, user.id);

  channel.sendEmbed({
    //author: user.id,
    color: 0x999999,
    title: `⚙ Current Nitro Engine parts for ${user.tag}:`,
    description: partInventory
      .getItems()
      .map((entry) => `    - **${entry.type}**: ${entry.amount}\n`)
      .join(""),
    //footer: channel
  });
};
