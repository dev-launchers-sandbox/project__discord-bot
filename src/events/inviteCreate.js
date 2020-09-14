const Discord = require("discord.js");
const inviteManager = require("../utils/inviteManager.js");

module.exports = async (client, invite) => {
  inviteManager.fetchNewInvite(client, invite);
};
