const Discord = require("discord.js");
const updateCounters = require("../../utils/updateCounters.js");
const metrics = require("../../index.js");

module.exports = async (client, member) => {
  metrics.sendEvent("guild_member_remove");
  updateCounters.updateCounters(member, client);
};
