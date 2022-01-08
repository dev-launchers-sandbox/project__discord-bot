const Discord = require("discord.js");
const metrics = require("../../../../index.js");
const db = require("quick.db");

console.log("required");
exports.eventHandle = "guildMemberUpdate";
exports.event = async (client, oldMember, newMember) => {
  metrics.sendEvent("ready");

  //If the user did not get a new role, ignore it.
  if (!(oldMember._roles.length < newMember._roles.length)) return;

  // prettier-ignore
  let roleAdded = newMember._roles.filter((r) => !oldMember._roles.includes(r))[0];
  let guild = newMember.guild;
  if (roleAdded === db.get(`minecraft-role.${guild.id}`)) {
    let mcChannelId = db.get(`minecraft-channel.${guild.id}`);
    if (!mcChannelId);
    let mcChannel = guild.channels.resolve(mcChannelId);
    mcChannel.sendEmbed({
      color: 0xff9f01,
      description: `${newMember.toString()} Welcome to Minecraft!
      Server IP: minecraft.devlaunchers.org`,
    });
  }
};
