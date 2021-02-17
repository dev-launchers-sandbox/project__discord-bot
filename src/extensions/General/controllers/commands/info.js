const Discord = require("discord.js");
const moment = require("moment");
const getMessageTarget = require("../../../../utils/getMessageTarget.js");

module.exports.help = {
  name: "info",
  description: "Displays infomation about a user",
  usage: "info [@user]",
  example: "info @Wumpus#0001s",
};

module.exports.conf = {
  aliases: [],
  cooldown: 5,
};

module.exports.run = async (client, message, args) => {
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

  message.channel.sendEmbed({
    color: 0xff9f01,
    thumbnail: avatar,
    author: { name: target.user.tag, image: avatar },
    fields: [
      { name: "ID", value: target.id, inline: true },
      { name: "Account Creation Date", value: createdate, inline: true },
      { name: "Server Join Date", value: joindate, inline: false },
      { name: "Status", value: status, inline: true },
    ],
  });
};
