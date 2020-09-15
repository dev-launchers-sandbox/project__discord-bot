const Discord = require("discord.js");
const inviteManager = require("../utils/inviteManager.js");
const metrics = require("../index.js");

module.exports = async (client, invite) => {
  metrics.sendEvent("invite_create");
  inviteManager.fetchNewInvite(client, invite);
};
