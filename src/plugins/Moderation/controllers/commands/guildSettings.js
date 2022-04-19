const Discord = require("discord.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");
const settings = require("./../../assets/settings.json");

exports.help = {
  name: "guildSettings",
  description: "Change the settings for the server",
  usage: "guildSettings [type] [value]",
  example: "guildSettings prefix !",
};

exports.conf = {
  aliases: ["setting"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

exports.run = async (client, message, args) => {
  const { channel, guild } = message;
  const sortedSettings = settings.sort((a, b) => a.displayName - b.displayName);

  if (!args[0] || !settings.some((s) => s.displayName.toLowerCase() === args[0].toLowerCase())) {
    sendBaseEmbed(channel, sortedSettings, guild.name);
  } else if (!args[1]) {
    sendValueEmbed(args[0].toLowerCase(), guild.id, channel, settings);
  } else updateValue(args[0].toLowerCase(), settings, args, channel, guild.id);
};

function sendBaseEmbed(channel, sortedSettings, guildName) {
  const modifiableSettings =
    "─── Single Value ───\n" +
    sortedSettings
      .filter((s) => ["string", "integer"].includes(s.type))
      .map((s) => `- ${s.displayName}`)
      .join("\n") +
    "\n─── Multiple Values ───\n" +
    sortedSettings
      .filter((s) => s.type === "array")
      .map((s) => `- ${s.displayName}`)
      .join("\n");

  //Send default embed
  channel.sendEmbed({
    color: 0xff9f01,
    author: { name: `⚙️ ${guildName} Settings` },
    description: modifiableSettings,
    footer:
      "Run (guildSetting + setting name) to see the value! Run (guildSetting + setting name + value) to upate the value! ",
  });
}

async function sendValueEmbed(displayName, guildId, channel, settings) {
  const setting = settings.find((s) => s.displayName.toLowerCase() === displayName);
  const isArray = setting.type === "array";
  const value = await dbh[setting.model].getField(guildId, setting.fieldName);

  const description = `The value of ${displayName} is **${
    value && value.length !== 0 ? (!isArray ? value : JSON.stringify(value)) : "not defined"
  }**`;

  channel.sendEmbed({
    color: 0xff9f01,
    description: description,
  });
}

async function updateValue(displayName, settings, args, channel, guildId) {
  const setting = settings.find((s) => s.displayName.toLowerCase() === displayName);
  if (setting.type === "array")
    updateArrayValue(args[1], args.length >= 3 ? args[2] : null, channel, setting, guildId);
  else updateSingleValue(args[1], setting, guildId, channel);
}

async function updateArrayValue(operation, value, channel, setting, guildId) {
  const { displayName, fieldName, type, model } = setting;
  if (!["remove", "add"].includes(operation) || !value) {
    const description =
      `The field ${displayName} allows multiple values. To add and remove values, please use the following syntax:\n` +
      `- **Adding a new value:** guildSettings ${displayName} add VALUE\n` +
      `- **Removing an existing value:** guildSettings ${displayName} remove VALUE\n`;

    return channel.sendEmbed({
      color: 0xff9f01,
      author: { name: `Incorrect Syntax` },
      description: description,
    });
  }
  const dbValue = await dbh[model].getField(guildId, fieldName);
  if (operation === "add") {
    if (dbValue.includes(value)) {
      return channel.sendEmbed({
        color: 0xff9f01,
        description: `Value ${value} is already in ${displayName}`,
      });
    }

    dbValue.push(value);
    await dbh[model].setField(guildId, fieldName, dbValue);
    return channel.sendEmbed({
      color: 0xff9f01,
      description: `Successfully updated ${displayName} to **${JSON.stringify(dbValue)}**`,
    });
  }
  if (operation === "remove") {
    if (!dbValue.includes(value)) {
      return channel.sendEmbed({
        color: 0xff9f01,
        description: `Value ${value} is not in ${displayName}`,
      });
    }

    dbValue.splice(dbValue.indexOf(value), 1);
    await dbh[model].setField(guildId, fieldName, dbValue);
    return channel.sendEmbed({
      color: 0xff9f01,
      description: `Successfully removed ${value} from ${displayName}. The new value is **${JSON.stringify(
        dbValue
      )}**`,
    });
  }
}

async function updateSingleValue(value, setting, guildId, channel) {
  const { fieldName, model, type, displayName } = setting;
  const isString = type === "string";
  if (!(isNaN(value) === isString)) {
    return channel.sendEmbed({
      color: 0xff9f01,
      description: `Unexpected value. Expected a ${type} but instead found a ${
        isNaN(value) ? "string" : "integer"
      }`,
    });
  }
  await dbh[model].setField(guildId, fieldName, value);
  channel.sendEmbed({
    color: 0xff9f01,
    description: `Sucessfully updated the value of ${displayName} to **${value}**`,
  });
}
