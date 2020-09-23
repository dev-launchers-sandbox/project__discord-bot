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
  let icon = member.guild.iconURL({ size: 2048, dynamic: true });
  let avatar = member.user.displayAvatarURL({ size: 2048 });
  // If a channel with the name "welcome", we just want to return.
  if (!welcomeChannel) return;
  const welcomeEmbed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.tag}`, avatar)
    .setDescription(`Welcome **${member.user.username}**, thanks for joining!`)
    .setFooter(`DevLaunchers`, icon)
    .setColor(0xff9f01);
  welcomeChannel.send(welcomeEmbed);
}

function sendInviteInfo(client, invite, member) {
  const inviteChannelID = db.get(`invite.${invite.guild.id}`);
  if (!inviteChannelID) return;

  const inviteChannel = client.channels.resolve(inviteChannelID);
  if (!inviteChannel) return;

  let code;
  let uses;
  let inviter;
  const newMember = member.user.tag;
  const avatar = member.user.avatarURL({ size: 2048 });
  let inviteEmbed;
  if (invite) {
    code = invite.code;
    uses = invite.uses;
    inviter = invite.inviter.tag;

    inviteEmbed = new Discord.MessageEmbed()
      .setAuthor(`${newMember} using ${inviter}`, avatar)
      .setColor(0xff9f01)
      .setDescription(`Num of Uses: \`${uses}\` Invite Used: \`${code}\``)
      .setFooter(`Member Count: ${invite.guild.memberCount}`);
  } else {
    inviteEmbed = new Discord.MessageEmbed.setColor(0xff9f01)
      .setAuthor(`${newMember} joined`, avatar)
      .setDescription(`I could not figure out how ${newMember} joined...`)
      .setFooter(`Member Count: ${member.guild.memberCount}`);
  }

  inviteChannel.send(inviteEmbed);
}
