const Discord = require("discord.js");
const updateCounters = require("../utils/updateCounters.js");
const db = require("quick.db");
const inviteManager = require("../utils/inviteManager.js");
const metrics = require("../index.js");

module.exports = async (client, member) => {
  metrics.sendEvent("guild_member_add");
  updateCounters.updateCounters(member, client);
  sendWelcomeEmbed(client, member);

  const inviteUsed = await inviteManager.findInviteUsed(client, member);
  sendInviteInfo(client, inviteUsed, member);
};

function sendWelcomeEmbed(client, member) {
  let welcomeChannelID = db.get(`welcome.${member.guild.id}`);
  if (!welcomeChannelID) return;
  const welcomeChannel = member.guild.channels.cache.find(
    (channel) => channel.id === welcomeChannelID
  );
  if (!welcomeChannelID) return;
  let icon = client.user.displayAvatarURL({ size: 2048 });
  let avatar = member.user.displayAvatarURL({ size: 2048 });
  // If a channel with the name "welcome", we just want to return.
  if (!welcomeChannel) return;
  const welcomeEmbed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.tag}`, avatar, avatar)
    .setDescription(`Welcome **${member.user.username}**, thanks for joining!`)
    .setFooter(`DevLaunchers`, icon, icon)
    .setColor(0xff9f01);
  welcomeChannel.send(welcomeEmbed);
}

function sendInviteInfo(client, invite, member) {
  const inviteChannelID = db.get(`invite.${invite.guild.id}`);
  if (!inviteChannelID) return;

  const inviteChannel = client.channels.resolve(inviteChannelID);
  if (!inviteChannel) return;

  const code = invite.code;
  const uses = invite.uses;
  const inviter = invite.inviter.tag;
  const newMember = member.user.tag;
  const avatar = member.user.avatarURL({ size: 2048 });

  const inviteEmbed = new Discord.MessageEmbed()
    .setAuthor(`${newMember} using ${inviter}`, avatar)
    .setColor(0xff9f01)
    .setDescription(`Num of Uses: \`${uses}\` Invite Used: \`${code}\``)
    .setFooter(`Member Count: ${invite.guild.memberCount}`);

  inviteChannel.send(inviteEmbed);
}