const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

const PartInventory = require("../../structures/PartInventory.js");
const PartBox = require("../../structures/PartBox.js");

const ACTIVITY_TIME_REQUIREMENT = 1000 * 60 * 60 * 24; // in milliseconds

exports.eventHandle = "messageReactionAdd";
exports.event = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_add");

  if (
    isNitroDropReaction(messageReaction) &&
    !isNitroDropClaimed(messageReaction) &&
    user.id != client.user.id
  ) {
    if (
      dbh.nitroEngine.getUserLastMessageTime(user.id) <
      Date.now() - ACTIVITY_TIME_REQUIREMENT
    ) {
      // Remove user emoji
      user.send(
        "Sorry, but you must have been **active in the server within the past 24 hours** to claim part drops.\n\n*Come say hello, tell us about your day, show off a project you're working on, ask a question, or... well, you get it!*"
      );
      reaction.message.reactions.cache.first().users.remove(user.id);
      return;
    }

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
