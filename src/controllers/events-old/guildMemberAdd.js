const Discord = require("discord.js");
const updateCounters = require("../../utils/updateCounters.js");

const metrics = require("../../index.js");

module.exports = async (client, member) => {
  metrics.sendEvent("guild_member_add");
  updateCounters.updateCounters(member, client);
};
