const Discord = require("discord.js");
const db = require("quick.db");
const getMessageTarget = require("../../utils/getMessageTarget");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return;
  if (!client.config.owners.includes(message.author.id)) return;

  await message.guild.members.cache.forEach(async (member) => {
    let devBeans = await db.get(`account.${member.id}.devBeans`);
    let goldenBeans = await db.get(`account.${member.id}.goldenBeans`);

    if (!devBeans) devBeans = 0;
    if (!goldenBeans) goldenBeans = 0;

    db.set(`account.${member.id}.foreverDevBeans`, devBeans);
    db.set(`account.${member.id}.foreverGoldenBeans`, goldenBeans);
  });
  message.reply("Ok it seems like I am done");
};

exports.help = {
  name: "update",
  description:
    "Danger Command - updates the all times beans to the current season beans",
  usage: `update`,
  example: `update`,
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
