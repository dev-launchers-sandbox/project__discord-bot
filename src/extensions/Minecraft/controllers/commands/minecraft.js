const Discord = require("discord.js");
const { MinecraftServerListPing, MinecraftQuery } = require("minecraft-status");

module.exports.help = {
  name: "minecraft",
  description: "Show information about commands",
  usage: "help [command]",
  example: "help info",
};

module.exports.conf = {
  aliases: ["mc"],
  cooldown: 5,
};

module.exports.run = async (client, message, args) => {
  message.delete();
  MinecraftServerListPing.ping(4, "72.249.104.219", 31672, 3000)
    .then((response) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(response.description.extra[0].text)
        .addField("Max Players", response.players.max)
        .addField("Online Players", response.players.online)
        .addField("Version", response.version.name)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setColor(0xff9f01);
      message.author.send(embed);
    })
    .catch((error) => {
      console.log(error);
      message.author.send(
        "```" +
          "There was an issue while trying to fetch the server’s data. The server is probably offline and/or in maintenance." +
          "```"
      );
    });
};
