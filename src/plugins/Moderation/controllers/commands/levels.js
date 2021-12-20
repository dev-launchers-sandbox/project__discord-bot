const Discord = require("discord.js");

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
    return sendOptionsEmbed(message);
  }

  if (!args[1]) {
    return sendLevelValueEmbed(message, args);
  }

  if (["delete", "remove"].includes(args[1])) {
    db.delete(`levels.${message.guild.id}.${args[0]}`);
    return sendDeletedValueEmbed(message, args);
  }

  db.set(`levels.${message.guild.id}.${args[0]}`, args[1]);
  sendUpdatedValueEmbed(message, args);
};

function sendOptionsEmbed(message) {
  message.channel.sendEmbed({
    color: 0xff9f01,
    title: `Level-Roles for ${message.guild.name}`,
    footer:
      "Use levels [name] [value] to set a value | Use delete to delete it",
    fields: [
      { name: "Level-Roles", value: lvls.map((x) => `\`${x}\``).join(" | ") },
    ],
  });
}

function sendLevelValueEmbed(message, args) {
  const value = db.get(`levels.${message.guild.id}.${args[0]}`);
  const role = message.guild.roles.resolve(value || "");

  message.channel.sendEmbed({
    color: 0xff9f01,
    description: `The value for the level ${args[0]} is ${
      role ? role : value ? `${value}` : "**Not defined**"
    }`,
  });
}

function sendDeletedValueEmbed(message, args) {
  message.channel.sendEmbed({
    color: 0xff9f01,
    description: `✅ | The value of ${args[0]} has been deleted.`,
    footer: `You can set it back by doing .levels ${args[0]} <value>`,
  });
}

function sendUpdatedValueEmbed(message, args) {
  message.channel.sendEmbed({
    color: 0xff9f01,
    description: `✅ | The value of ${args[0]} has been updated. The new value is ${args[1]}.`,
  });
}
