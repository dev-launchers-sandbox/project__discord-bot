const metrics = require("../../../../index.js");
const { newUserRoles } = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");
const db = require("quick.db");
exports.eventHandle = "message";
exports.event = async (client, message, args) => {
  metrics.sendEvent("message");

  let { guild, channel, member } = message;

  if (member.user.bot) return;
  let introductionsChannel = db.get(`introductions-channel.${guild.id}`);

  if (channel.id === (introductionsChannel && introductionsChannel.toString())) {
    let roles = newUserRoles.getRoles(message.guild.id);
    for (let role of roles) {
      message.member.roles.add(role);
    }
  }
};
