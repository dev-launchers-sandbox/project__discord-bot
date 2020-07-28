const Discord = require("discord.js");
const db = require("quick.db");

let guildInvites = new Map();
module.exports = {
  fetchInvites: function(bot) {
    bot.guilds.cache.forEach(guild => {
      guild
        .fetchInvites()
        .then(invites => guildInvites.set(guild.id, invites))
        .catch(err => console.log(err));
    });
  },
  awardInviter: async function(member) {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
      const usedInvites = newInvites.find(inv => cachedInvites.get(inv.code));
      let inviterID = usedInvites.inviter.id;
      db.add(`account.${inviterID}.balance`, 50);
    } catch (error) {
      console.log(error);
    }
  },
  /*removeInviter: async function(member) {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
      const usedInvites = newInvites.find(inv => cachedInvites.get(inv.code));
      let inviterID = usedInvites.inviter.id;
      db.subtract(`account.${inviterID}.balance`, 50);
    } catch (error) {
      console.log(error);
    }
  },*/
  updateInviteFetch: async function(invite) {
    guildInvites.set(invite.guild.id, await invite.guild.fetchInvites);
  }
};
