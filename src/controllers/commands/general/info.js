const Discord = require("discord.js");
const moment = require("moment");
const getMessageTarget = require("../../../utils/getMessageTarget.js");

exports.run = async (client, message, args) => {
  let target = getMessageTarget.getMessageTarget(message, args);
  if (!target) target = message.guild.members.resolve(message.author.id);

  if (target.user.presence.status === "dnd")
    target.user.presence.status = "Do Not Disturb";
  if (target.user.presence.status === "idle") target.presence.status = "Idle";
  if (target.user.presence.status === "offline")
    target.presence.status = "Offline";
  if (target.user.presence.status === "online")
    target.presence.status = "Online";

  let createdate = moment
    .utc(target.user.createdAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let joindate = moment
    .utc(target.joinedAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let status = target.user.presence.status;
  let avatar = target.user.avatarURL({ size: 2048 });

  const infoEmbed = new Discord.MessageEmbed()
    .setAuthor(target.user.tag, avatar)
    .setThumbnail(avatar)
    .setTimestamp()
    .setColor(0xff9f01)
    .addField("ID", target.id, true)
    .addField("Created Account Date", `${createdate}`, true)
    .addField("Broken Joined Server Date", `${joindate}`)
    .addField("Status", status, true);
  message.channel.send(infoEmbed);
};

exports.help = {
  name: "info",
  description: "Displays infomation about a user",
  usage: "info [@user]",
  example: "info @Wumpus#0001s",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
