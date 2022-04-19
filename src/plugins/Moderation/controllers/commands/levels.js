const Discord = require("discord.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

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
  const { guild, channel } = message;
  if (!args[0] || !lvls.includes(args[0])) {
    return sendOptionsEmbed(channel, guild.name);
  }

  const levels = await dbh.guild.getLevels(message.guild.id);

  const levelIndex = levels.findIndex((l) => l.number === args[0]);
  const level = levels[levelIndex];
  const levelName = args[0];

  if (!args[1]) {
    return sendLevelValueEmbed(channel, guild, level, levelName);
  } else if (["delete", "remove"].includes(args[1])) {
    return sendDeletedValueEmbed(channel, levels, levelIndex, levelName, guild.id);
  } else sendUpdatedValueEmbed(channel, levels, level, levelName, levelIndex, guild.id, args[1]);
};

function sendOptionsEmbed(channel, guildName) {
  channel.sendEmbed({
    color: 0xff9f01,
    title: `Level-Roles for ${guildName}`,
    footer: "Use levels [name] [value] to set a value | Use delete to delete it",
    fields: [{ name: "Level-Roles", value: lvls.map((x) => `\`${x}\``).join(" | ") }],
  });
}

async function sendLevelValueEmbed(channel, guild, level = {}, levelName) {
  const role = guild.roles.resolve(level.value || "");

  channel.sendEmbed({
    color: 0xff9f01,
    description: `The value for the level ${levelName} is ${
      role ? role : level.value ? `${level.value}` : "**Not defined**"
    }`,
  });
}

async function sendDeletedValueEmbed(channel, levels, levelIndex, levelName, guildId) {
  if (levelIndex !== null) {
    levels[levelIndex].value = null;
  }
  dbh.guild.setLevels(guildId, levels);

  channel.sendEmbed({
    color: 0xff9f01,
    description: `✅ | The value of ${levelName} has been deleted.`,
    footer: `You can set it back by doing .levels ${levelName} <value>`,
  });
}

function sendUpdatedValueEmbed(channel, levels, level, levelName, levelIndex, guildId, newValue) {
  if (!level) levels.push({ number: levelName, value: newValue });
  else levels[levelIndex].value = newValue;
  dbh.guild.setLevels(guildId, levels);

  channel.sendEmbed({
    color: 0xff9f01,
    description: `✅ | The value of ${levelName} has been updated. The new value is ${newValue}.`,
  });
}
