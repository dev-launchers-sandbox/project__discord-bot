require("dotenv").config();
const Discord = require("discord.js");
const devlaunchersBot = require("./handler/ClientBuilder.js");
const client = new devlaunchersBot({ partials: ["MESSAGE", "REACTION"] });

require("./handler/module.js")(client);
require("./handler/Event.js")(client);

client.package = require("../package.json");
client.on("warn", console.warn);
client.on("error", console.error);
client.login("NzE3MTI0NTA4MTg3NjIzNTIw.XtVwPg.MmyxhHQO0xQVK4wrRwbFRy1TtzM");
