const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

const PartInventory = require("../../structures/PartInventory.js");
const PartBox = require("../../structures/PartBox.js");

exports.eventHandle = "messageReactionAdd";
exports.event = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_add");

  if (
    isNitroDropReaction(messageReaction) &&
    !isNitroDropClaimed(messageReaction) &&
    user.id != client.user.id
  ) {
    let message = messageReaction.message;
    let embed = message.embeds[0];

    // Add part to user part inventory
    let partInventory = new PartInventory(dbh, client, user.id);
    let partBox = new PartBox();
    let part = partBox.open();
    partInventory.addPart(part);

    // Change embed
    embed.setDescription(
      `👐 This part ***(${part.getType()})*** has been claimed by ${user.tag}`
    );
    embed.setColor(0x999999);
    message.edit(embed);
    message.reactions.removeAll();
  }
};

function isNitroDropReaction(messageReaction) {
  let embeds = messageReaction.message.embeds;
  if (
    messageReaction.emoji.name == "📦" &&
    embeds[0].title == "⚙ NITRO ENGINE PART DROP!"
  )
    return true;
  return false;
}

function isNitroDropClaimed(messageReaction) {
  let embeds = messageReaction.message.embeds;
  if (
    embeds[0].description != "Be the first to click the 📦 to claim this part"
  )
    return true;
  return false;
}
