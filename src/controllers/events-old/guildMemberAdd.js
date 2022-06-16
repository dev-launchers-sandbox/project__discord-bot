const Discord = require("discord.js");
const updateCounters = require("../../utils/updateCounters.js");
const db = require("quick.db");
const metrics = require("../../index.js");
const { User } = require("./../../../api/models/index.js");

module.exports = async (client, member) => {
  metrics.sendEvent("guild_member_add");
  updateCounters.updateCounters(member, client);
};
