const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../utils/commandUsage.js");

exports.run = async (client, message, args) => {
  const instancedChannels = db.get(`instanced.${message.guild.id}`);

  if (!instancedChannels)
    return message.channel.send({
      embed: {
        color: "RED",
        description:
          "You can only run this command in a public instanced channel",
      },
    });

  const instancedChannel = instancedChannels.find(
    (channel) => channel.newChannel === message.channel.id
  );

  if (!instancedChannel)
    return message.channel.send({
      embed: {
        color: "RED",
        description:
          "You can only run this command in a public instanced channel",
      },
    });

  const instancedOwner = instancedChannel.creator;

  if (
    !(
      message.member.hasPermission("ADMINISTRATOR") ||
      instancedOwner === message.author.id
    )
  ) {
    return commandUsage.noPerms(message, "Administrator or channel creator");
  }

  const directoryEntryId = instancedChannel.directoryEntry;
  if (!directoryEntryId)
    return message.channel.send(
      "In order to run this command, you need to be in a __public__ instanced channel!"
    );

  const directoryChannelID = db.get(`directory.${message.guild.id}`) || "None";
  const directoryChannel = message.guild.channels.resolve(directoryChannelID);
  if (!directoryChannel) return;
  const directoryEntry = await directoryChannel.messages.fetch(
    directoryEntryId
  );
  if (!directoryEntry) return console.log("No entry?");

  let newDescription = args.join(" ");
  if (!newDescription) {
    return commandUsage.missingParams(
      message,
      "New Description",
      "description"
    );
  }
  if (newDescription.length > 80) {
    message.channel.send("Descriptions must be less than 30 characters!");
    return;
  }
  if (newDescription === "remove" || newDescription === "delete")
    newDescription = "No description";

  const newEntry = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(
      `${message.channel.name} channel`,
      message.guild.iconURL({ dynamic: true })
    )
    .setDescription(`*${newDescription}*`)
    .setFooter("React to this message to join the channel!");

  directoryEntry
    .edit(newEntry)
    .then(workedConfirmation(message, newDescription))
    .catch((err) => console.log("Error in directory"));
};
//message.channel.send("There was an unexpected error!")

function workedConfirmation(message, newDescription) {
  if (newDescription === "No description") {
    message.channel.send(
      "I successfully removed the description for this channel!"
    );
  } else {
    message.channel.send(
      `I successfully updated the description to: *${newDescription}*`
    );
  }
}
exports.help = {
  name: "description",
  description: "Sets the description for an instanced channel",
  usage: `description <content>`,
  example: `description in this channel we play games!`,
};

exports.conf = {
  aliases: [],
  cooldown: 25,
};
