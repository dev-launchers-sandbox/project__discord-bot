const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const metrics = require("../../index.js");

async function fetchMessage(client, messageReaction, user) {
  if (messageReaction.message.partial) {
    return await messageReaction.fetch();
  } else return messageReaction;
}

module.exports = async (client, messageReaction, user) => {
  metrics.sendEvent("remove");
  if (user.bot) return;
  if (messageReaction.emoji.name === "villager") {
    let message = await fetchMessage(client, messageReaction, user);
    return removeMinecraftRole(client, message, user, messageReaction);
  }
};

function removeMinecraftRole(client, message, user, messageReaction) {
  const minecraftMsg = db.get(`minecraft.${messageReaction.message.guild.id}`);
  const role = db.get(`minecraft-role.${messageReaction.message.guild.id}`);

  if (messageReaction.message.id === minecraftMsg) {
    messageReaction.message.guild.members.resolve(user.id).roles.remove(role);
  }
}
