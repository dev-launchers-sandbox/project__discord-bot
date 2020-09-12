const Discord = require("discord.js");
const db = require("quick.db");

function sendMessage(message, target, reason, punishment) {
  let embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(
      `You have been ${punishment} from: ${message.guild.name}`,
      target.user.displayAvatarURL()
    )
    .setDescription(`Reason: ${reason || "No Reason Provided"}`)
    .setTimestamp();
  try {
    target.send(embed);
  } catch (error) {
    console.log("Could not send the embed");
  }
}

exports.sendMessage = sendMessage;
