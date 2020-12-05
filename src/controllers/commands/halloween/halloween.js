const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return;
  const rooms = [
    "kris-room",
    "kitchen",
    "backyard",
    "dog-park",
    "phone",
    "devlaunchers-hq",
    "vault",
    "conclusion",
    "log-channel",
  ];

  const room = args[0];
  if (!room) {
    return sendBasicEmbed(message, rooms);
  }

  if (!rooms.includes(room)) {
    return message.channel.send("Could not find the room");
  }

  const newValue = args[1];

  if (!newValue) {
    return sendSpecificValueEmbed(message, room);
  }

  db.set(`halloween.${room}.${message.guild.id}`, newValue);
  sendConfirmationMessage(message, newValue);
};

function sendBasicEmbed(message, rooms) {
  const basicEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle(`Halloween Event Settings`)
    .setFooter(
      "Use halloween [name] [value] to set a value | Use delete to delete it"
    );

  basicEmbed.addField(`Settings`, rooms.map((x) => `\`${x}\``).join(" | "));

  message.channel.send(basicEmbed);
}

async function sendSpecificValueEmbed(message, roomRole) {
  const value = await db.get(`halloween.${roomRole}.${message.guild.id}`);
  const specificValueEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(`${roomRole} value`)
    .setDescription(`The value is ${value || "**null**"}`);
  message.channel.send(specificValueEmbed);
}

function sendConfirmationMessage(message, value) {
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setDescription(`The value has been updated to ${value}`);
  message.channel.send(embed);
}

exports.help = {
  name: "halloween",
  description: "Change the roles for the halloween event",
  usage: "halloween [room] [idOfRole]",
  example: "halloween kitchen 712064133259853848",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
