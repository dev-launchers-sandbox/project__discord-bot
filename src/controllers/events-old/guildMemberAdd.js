const Discord = require("discord.js");
const updateCounters = require("../../utils/updateCounters.js");
const db = require("quick.db");
const metrics = require("../../index.js");
const { User } = require("./../../../api/models/index.js");

module.exports = async (client, member) => {
  metrics.sendEvent("guild_member_add");
  updateCounters.updateCounters(member, client);
  let dbUser = await User.create({ id: member.id });
  console.log(
    `Created new user! id: ${dbUser.id}, devBeans: ${dbUser.devBeans}, goldenBeans: ${dbUser.goldenBeans}`
  );
  sendWelcomeEmbed(client, member);
};

function sendWelcomeEmbed(client, member) {
  let welcomeChannelID = db.get(`welcome.${member.guild.id}`);
  if (!welcomeChannelID) return;
  const welcomeChannel = member.guild.channels.resolve(welcomeChannelID);
  if (!welcomeChannel) return;
  let icon = member.guild.iconURL({ size: 2048, dynamic: true });
  let avatar = member.user.displayAvatarURL({ size: 2048 });
  if (!welcomeChannel) return;

  const welcomeEmbed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.tag}`, avatar)
    .setDescription(`Welcome to DevLaunchers **${member.user.username}**`)
    .setFooter(` | ${member.id}`, icon)
    .setColor(0xff9f01);
  welcomeChannel.send(welcomeEmbed);
  welcomeChannel.send(member.user.toString()).then((m) => m.delete());

  let controlCenterID = db.get(`control-center.${member.guild.id}`) || "null";
  let controlChannel = member.guild.channels.resolve(controlCenterID);
  if (!controlChannel) return;

  controlChannel.send(member.user.toString()).then((m) => m.delete());
}
