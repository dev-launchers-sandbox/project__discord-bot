const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const CommandHandler = require("../../../.common/structures/CommandHandler/CommandHandler.js");

const EngineInventory = require("../../structures/EngineInventory.js");
const PartInventory = require("../../structures/PartInventory.js");
const NitroEngineAssembler = require("../../structures/NitroEngineAssembler.js");

exports.help = {
  name: "craftEngine",
  description: "Build a Nitro Engine from collected parts",
  usage: "craftEngine",
  example: "craftEngine",
};

exports.conf = {
  aliases: ["craftEngine", "assembleEngine", "craftNitro"],
  cooldown: 5,
  permissions: [],
  arguments: [],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let user = message.author;

  let userPartInventory = new PartInventory(dbh, client, user.id);
  let userEngineInventory = new EngineInventory(dbh, client, user.id);
  let engineAssembler = new NitroEngineAssembler(dbh, client);

  let engine = engineAssembler.assembleEngine(
    userPartInventory,
    userEngineInventory
  );

  if (engine) {
    channel.sendEmbed({
      color: 0x00ff00,
      title: "🔧 CONGRATULATIONS!!! Your Nitro Engine has been assembled!",
    });
  } else {
    channel.sendEmbed({
      color: 0xff0000,
      title: "❌ You do not have the required parts to build a Nitro Engine",
    });
  }
};
