const Discord = require("discord.js");

const guildInvites = new Map();

function fetchInvites(client) {
  client.guilds.cache.forEach((guild) => {
    guild
      .fetchInvites()
      .then((invites) => guildInvites.set(guild.id, invites))
      .catch((err) => console.log(err));
  });
}

async function findInviteUsed(client, member) {
  const cachedInvites = guildInvites.get(member.guild.id);
  const newInvites = await member.guild.fetchInvites();
  guildInvites.set(member.guild.id, newInvites);
  try {
    const usedInvite = newInvites.find(
      (inv) => cachedInvites.get(inv.code).uses < inv.uses
    );
    return usedInvite;
  } catch (err) {
    console.log("Error while getting the invite");
  }
}

async function fetchNewInvite(client, invite) {
  guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
}

exports.fetchInvites = fetchInvites;
exports.findInviteUsed = findInviteUsed;
exports.fetchNewInvite = fetchNewInvite;
