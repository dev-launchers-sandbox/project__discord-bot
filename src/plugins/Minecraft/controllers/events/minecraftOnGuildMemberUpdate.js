const Discord = require("discord.js");
const metrics = require("../../../../index.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.eventHandle = "guildMemberUpdate";
exports.event = async (client, oldMember, newMember) => {
  const { guild } = newMember;

  //If the user did not get a new role, ignore it.
  if (!(oldMember._roles.length < newMember._roles.length)) return;
  const roleAdded = newMember._roles.filter((r) => !oldMember._roles.includes(r))[0];
  const minecraftRole = await dbh.guild.getMinecraftRole(guild.id);

  if (roleAdded !== minecraftRole) return;
  const minecraftChannelId = await dbh.channels.getMinecraft(guild.id);

  if (!minecraftChannelId) return;
  const minecraftChannel = guild.channels.resolve(minecraftChannelId);
  if (!minecraftChannel) return;

  minecraftChannel.sendEmbed({
    color: 0xff9f01,
    description: `${newMember.toString()} Welcome to Minecraft!
    Server IP: minecraft.devlaunchers.org`,
  });
};
