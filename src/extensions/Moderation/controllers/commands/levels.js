const Discord = require("discord.js");
const db = require("quick.db");
const utils = require("./../../../../utils/commandUsage.js");

const lvls = [
  "one",
  "five",
  "ten",
  "fifteen",
  "twenty",
  "twenty-five",
  "thirty",
  "thirty-five",
  "forty",
];

exports.help = {
  name: "levels",
  description: "Set the level roles values",
  usage: `levels [level #] [new value]`,
  example: `levels five 712064133259853848`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

exports.run = async (client, message, args) => {
  if (!args[0] || !lvls.includes(args[0])) {
    return sendBasicEmbed(message);
  }

  if (!args[1]) {
    return sendLevelValueEmbed(message, args);
  }

  if (["delete", "remove"].includes(args[1])) {
    db.delete(`levels.${message.guild.id}.${args[0]}`);
    return sendDeleteConfirmationEmbed(message, args);
  }

  db.set(`levels.${message.guild.id}.${args[0]}`, args[1]);
  sendNewValueConfirmationEmbed(message, args);
};

function sendBasicEmbed(message) {
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle(`Level-Roles for ${message.guild.name}`)
    .setFooter(
      "Use levels [name] [value] to set a value | Use delete to delete it"
    );
  embed.addField(`Level-roles`, lvls.map((x) => `\`${x}\``).join(" | "));
  message.channel.send(embed);
}

function sendLevelValueEmbed(message, args) {
  const value = db.get(`levels.${message.guild.id}.${args[0]}`);
  const role = message.guild.roles.resolve(value || "");

  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setDescription(
      `The value for the level ${args[0]} is ${
        role ? role : value ? `${value}` : "**Not defined**"
      }`
    );
  message.channel.send(embed);
}

function sendDeleteConfirmationEmbed(message, args) {
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setDescription(`✅ | The value of ${args[0]} has been deleted.`)
    .setFooter(`You can set it back by doing .levels ${args[0]} <value>`);
  message.channel.send(embed);
}

function sendNewValueConfirmationEmbed(message, args) {
  const embed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setDescription(
      `✅ | The value of ${args[0]} has been updated. The new value is ${args[1]}.`
    );
  message.channel.send(embed);
}
