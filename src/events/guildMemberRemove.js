const Discord = require("discord.js");
const updateCounters = require("../utils/updateCounters.js");

module.exports = async (client, member) => {
  updateCounters.updateCounters(member, client);
};
