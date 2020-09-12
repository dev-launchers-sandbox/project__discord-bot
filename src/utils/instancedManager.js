const db = require("quick.db");

let instancedChannelsIDs = [];

async function updateInstancedChannels(guildID) {
  let instancedObjects = await db.get(`instanced.${guildID}`);
  if (!instancedObjects) {
    instancedChannelsIDs = [];
    return;
  }
  instancedObjects.forEach((obj) => {
    instancedChannelsIDs.push(obj.newChannel);
  });
}

exports.instancedChannelsIDs = instancedChannelsIDs;
exports.updateInstancedChannels = updateInstancedChannels;
