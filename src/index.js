const Discord = require("discord.js");
const devlaunchersBot = require("./handler/ClientBuilder.js");
const client = new devlaunchersBot({ partials: ["MESSAGE", "REACTION"] });

require("./handler/module.js")(client);
require("./handler/Event.js")(client);

client.package = require("../package.json");

//require("dotenv").config();

client.on("warn", console.warn);
client.on("error", console.error);
client.login("NzA5ODg5NTA5ODY0NjM2NDk2.XrseIA.8HmK18LLL_FtNaeHPVHqVLj0Jc0");
