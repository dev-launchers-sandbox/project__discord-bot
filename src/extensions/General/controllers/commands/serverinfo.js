const Discord = require("discord.js");
const dateformat = require("dateformat");

exports.help = {
  name: "ServerInfo",
  description: "Displays information about the server",
  usage: "serverinfo",
  example: "serverinfo",
};

exports.conf = {
  aliases: ["Server"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  let icon = message.guild.iconURL({ size: 2048, dynamic: true });

  const members = await message.guild.members.fetch();
  let offline = members.filter((m) => m.user.presence.status === "offline");
  let online = members.filter((m) => m.user.presence.status === "online");
  let idle = members.filter((m) => m.user.presence.status === "idle");
  let dnd = members.filter((m) => m.user.presence.status === "dnd");
  let bots = members.filter((m) => m.user.bot);
  let total = message.guild.memberCount;

  let created = dateformat(message.guild.createdAt);

  const owner = await message.guild.members.fetch(message.guild.ownerID);

  message.channel.sendEmbed({
    color: "0xff9f01",
    timestamp: true,
    thumbnail: icon,
    author: { name: `${message.guild.name}`, image: icon },
    description: `ID: **${message.guild.id}**`,
    fields: [
      { name: "Region", value: message.guild.region },
      { name: "Created On", value: created },
      { name: "Owner", value: `**${owner.user.tag}** \n\`${owner.user.id}\`` },
      {
        name: `Members [${total}]`,
        value: `Online: ${online.size} \nIdle ${idle.size} \nDND: ${dnd.size} \nOffline ${offline.size} \nBots: ${bots.size}`,
      },
    ],
  });
};
