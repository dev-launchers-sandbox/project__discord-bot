const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../utils/commandUsage.js");

exports.run = async (client, message, args) => {
  const instancedChannels = db.get(`instanced.${message.guild.id}`);

  if (!instancedChannels)
    return message.channel.send({
      embed: {
        color: "RED",
        description: "You can only run this command in a public thread",
      },
    });

  const instancedChannel = instancedChannels.find(
    (channel) => channel.newChannel === message.channel.id
  );

  if (!instancedChannel)
    return message.channel.send({
      embed: {
        color: "RED",
        description: "You can only run this command in a public thread",
      },
    });

  const instancedOwner = instancedChannel.creator;

  if (
    !(
      message.member.hasPermission("ADMINISTRATOR") ||
      instancedOwner === message.author.id
    )
  ) {
    return commandUsage.noPerms(message, "Administrator or thread creator");
  }

  const directoryEntryId = instancedChannel.directoryEntry;
  if (!directoryEntryId)
    return message.channel.send(
      "In order to run this command, you need to be in a __public__ thread!"
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
    message.channel.send("Descriptions must be less than 80 characters!");
    return;
  }
  if (newDescription === "remove" || newDescription === "delete") {
    newDescription = "No description";
    message.channel.setTopic(null);
  }

  const newEntry = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(
      `${message.channel.name} thread`,
      message.guild.iconURL({ dynamic: true })
    )
    .setDescription(`*${newDescription}*`)
    .setFooter("React to this message to join this thread!");

  directoryEntry
    .edit(newEntry)
    .then(workedConfirmation(message, newDescription))
    .catch((err) => console.log("Error in directory"));
  message.channel.setTopic(newDescription);
};

function workedConfirmation(message, newDescription) {
  if (newDescription === "No description") {
    message.channel.send(
      "I successfully removed the description for this thread!"
    );
  } else {
    message.channel.send(
      `I successfully updated the description to: *${newDescription}*`
    );
  }
}
exports.help = {
  name: "description",
  description: "Sets the description for a thread",
  usage: `description <content>`,
  example: `description we love potatoes!`,
};

exports.conf = {
  aliases: [],
  cooldown: 25,
};
