const Discord = require("discord.js");
const updateCounters = require("../utils/updateCounters.js");
const db = require("quick.db");

module.exports = async (client, member) => {
  updateCounters.updateCounters(member, client);
  sendWelcomeEmbed(client, member);
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
