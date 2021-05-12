const Discord = require("discord.js");
const db = require("quick.db");

module.exports = async (client) => {
  console.log("The bot is online");
  client.user.setActivity("DevLaunchers", { type: "WATCHING" });
};
