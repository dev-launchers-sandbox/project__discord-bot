const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  try {
    const m = await message.channel.send("Pinging...");
    const embed = new Discord.MessageEmbed()
      .setColor("0xff9f01")
      .addField(
        `⌛ Latency`,
        `**${m.createdTimestamp - message.createdTimestamp} ms**`
      )
      .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`);
    return m.edit("🏓 Pong", embed);
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
  }
};

exports.help = {
  name: "ping",
  description: "Check how fast the bot is and why",
  usage: "ping",
  example: "ping",
};

exports.conf = {
  aliases: ["latency", "API", "response"],
  cooldown: 5,
};
