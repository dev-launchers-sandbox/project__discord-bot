const Discord = require("discord.js");
const status = require("minecraft-server-status");

exports.help = {
  name: "minecraft",
  description: "Show information about commands",
  usage: "help [command]",
  example: "help info",
};

exports.conf = {
  aliases: ["mc"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  message.delete();
  status("minecraft.devlaunchers.com", 25565, (response) => {
    if (!response || response.status !== "success") {
      message.author.sendEmbed({
        color: 0xff9f01,
        description: "The server is currently not available",
      });
      return;
    }

    let { online, favicon, players, server } = response;

    message.author.sendEmbed({
      color: 0xff9f01,
      author: { image: message.guild.iconURL(), name: "Dev Launchers Minecraft Server" },
      fields: [
        { name: "IP:", value: "minecraft.devlaunchers.com:25565" },
        { name: "Version:", value: server.name, inline: true },
        { name: "Online:", value: online ? "🟢" : "🔴", inline: true },
        { name: "Players On:", value: players.now, inline: true },
      ],
      timestamp: Date.now(),
    });
  });
};
