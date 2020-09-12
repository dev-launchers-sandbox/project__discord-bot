const Discord = require("discord.js");
const moment = require("moment");

exports.run = async (client, message, args) => {
  let userInfo = message.mentions.users.first() || message.author;

  if (userInfo.presence.status === "dnd")
    userInfo.presence.status = "Do Not Disturb";
  if (userInfo.presence.status === "idle") userInfo.presence.status = "Idle";
  if (userInfo.presence.status === "offline")
    userInfo.presence.status = "Offline";
  if (userInfo.presence.status === "online")
    userInfo.presence.status = "Online";

  let createdate = moment
    .utc(userInfo.createdAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let joindate = moment
    .utc(userInfo.joinedAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let status = userInfo.presence.status;
  let avatar = userInfo.avatarURL({ size: 2048 });

  const infoEmbed = new Discord.MessageEmbed()
    .setAuthor(userInfo.tag, avatar)
    .setThumbnail(avatar)
    .setTimestamp()
    .setColor(0xff9f01)
    .addField("ID", userInfo.id, true)
    .addField("Created Account Date", `${createdate}`, true)
    .addField("Joined Server Date", `${joindate}`)
    .addField("Status", status, true);
  message.channel.send(infoEmbed);
};

exports.help = {
  name: "info",
  description: "Displays infomation about a user",
  usage: "-info [@user]",
  example: "-info @discord#0000",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
