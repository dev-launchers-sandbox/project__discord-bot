const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const metrics = require("../../../../index.js");

module.exports.eventHandle = "messageReactionAdd";
module.exports.event = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_add");

  if (messageReaction.isBeanReaction()) {
    console.log("SHOULD BE GIVING DEV BEAN!");
  }
};
