const Discord = require("discord.js");
const db = require("quick.db");

async function sendPunishment(guildName, target, reason, punishment) {
  let embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(
      `You have been ${punishment} from: ${guildName}`,
      target.user.displayAvatarURL()
    )
    .setDescription(`Reason: ${reason || "No Reason Provided"}`)
    .setTimestamp();
  try {
    await target.send(embed);
  } catch (error) {
    console.log("Could not send the embed");
  }
}

exports.sendPunishment = sendPunishment;
