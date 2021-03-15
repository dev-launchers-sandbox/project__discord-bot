const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");

const EngineInventory = require("../../structures/EngineInventory.js");

exports.help = {
  name: "myEngines",
  description: "Get a list of your current Nitro Engines",
  usage: "myEngines",
  example: "myEngines",
};

exports.conf = {
  aliases: ["getEngines"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let user = message.author;

  let engineInventory = new EngineInventory(dbh, client, user.id);

  channel.sendEmbed({
    //author: user.id,
    color: 0x999999,
    title: `⚙ ${
      user.tag
    } currently owns ${engineInventory.getNumEngines()} Nitro Engine(s)`,
  });
};
