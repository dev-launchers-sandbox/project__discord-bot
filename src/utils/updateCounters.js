const Discord = require("discord.js");
const db = require("quick.db");

const updateCounters = async (server, client) => {
  let channelID = await db.get(`total.${server.guild.id}`);
  if (!channelID) return;
  let totalMembersStats = await client.channels.resolve(channelID);
  if (!totalMembersStats) return;
  totalMembersStats
    .setName(`Total Members: ${server.guild.memberCount}`)
    .catch((err) => console.err());
};

exports.updateCounters = updateCounters;
