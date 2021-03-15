const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

const NitroEnginePartDropper = require("../../structures/NitroEnginePartDropper.js");
const PartBox = require("../../structures/PartBox.js");
const TaskManager = require("../../../.common/structures/Tasks/TaskManager.js");

// Send a discord nitro every 66 minutes
const DROP_CHANNEL_NAMES = [
  "general",
  "coding-chat",
  "art﹢design-chat",
  "sfx﹢music-chat",
];
const DROP_RATE = 1000 * 60 * 66; // In milliseconds

exports.eventHandle = "ready";
exports.event = async (client) => {
  metrics.sendEvent("ready");

  let taskManager = new TaskManager();

  const sendNitroPartDrop = () => {
    try {
      let partBox = new PartBox();
      // Get general channel
      let randomChannelName =
        DROP_CHANNEL_NAMES[parseInt(Math.random() * DROP_CHANNEL_NAMES.length)];
      let channel = client.channels.cache.find(
        (channel) => channel.name === randomChannelName
      );
      let partDropper = new NitroEnginePartDropper(dbh, client);
      partDropper.dropRandomPart(channel);
    } catch (e) {
      console.error(e);
    }
  };

  taskManager.addTask(sendNitroPartDrop, DROP_RATE);
};
