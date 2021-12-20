const Discord = require("discord.js");


module.exports = async (client) => {
  console.log("The bot is online");
  client.user.setActivity("DevLaunchers", { type: "WATCHING" });
};
