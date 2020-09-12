const Discord = require("discord.js");
const dateformat = require("dateformat");

exports.run = async (client, message, args) => {
  let icon = message.guild.iconURL({ size: 2048 });
  let region = {
    brazil: "Brazil",
    "eu-central": "Central Europe",
    singapore: "Singapore",
    london: "London",
    japan: "Japan",
    hongkong: "Hongkong",
    sydney: "Sydney",
    russia: "Russia",
    "us-central": "U.S. Central",
    "us-east": "U.S. East",
    "us-south": "U.S. South",
    "us-west": "U.S. West",
    "eu-west": "Western Europe",
  };

  let member = message.guild.members;
  let offline = member.cache.filter((m) => m.user.presence.status === "offline")
      .size,
    online = member.cache.filter((m) => m.user.presence.status === "online")
      .size,
    idle = member.cache.filter((m) => m.user.presence.status === "idle").size,
    dnd = member.cache.filter((m) => m.user.presence.status === "dnd").size,
    bots = member.cache.filter((m) => m.user.bot).size,
    total = message.guild.memberCount;

  let channels = message.guild.channels;
  let text = channels.cache.filter((r) => r.type === "text").size,
    vc = channels.cache.filter((r) => r.type === "voice").size,
    category = channels.cache.filter((r) => r.type === "category").size,
    totalchan = channels.cache.size;

  let location = region[message.guild.region];

  let created = dateformat(message.guild.createdAt);

  const serverInfoEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTimestamp(new Date())
    .setThumbnail(icon)
    .setAuthor(message.guild.name, icon)
    .setDescription(`ID: **${message.guild.id}**`)
    .addField("Region", location)
    .addField("Created On", `${created} `)
    .addField(
      "Owner",
      `**${message.guild.owner.user.tag}** \n\`${message.guild.owner.user.id}\``
    )
    .addField(
      `Members [${total}]`,
      `Online: ${online} \nIdle ${idle} \nDND: ${dnd} \nOffline ${offline} \nBots: ${bots}`
    )
    .addField(
      `Channels [${totalchan}]`,
      `Text: ${text} \nVoice: ${vc} \nCategory: ${category}`
    );
  message.channel.send(serverInfoEmbed);
};

exports.help = {
  name: "serverinfo",
  description: "Displays information about the server",
  usage: "-serverinfo",
  example: "-serverinfo",
};

exports.conf = {
  aliases: ["server", "si"],
  cooldown: 5,
};
