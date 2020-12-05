const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  const threads = db.get(`instanced.${message.guild.id}`);
  if (!isValid(message, threads)) return;

  const threadObject = threads.find(
    (thread) => thread.newChannel === message.channel.id
  );

  const directoryChannelId = db.get(`directory.${message.guild.id}`);
  if (!directoryChannelId) return;

  const directoryChannel = message.guild.channels.resolve(directoryChannelId);

  const newChannelEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setAuthor(
      `${message.channel.name} thread`,
      message.guild.iconURL({ dynamic: true })
    )
    .setDescription("*No description*")
    .setFooter("React to this message to join the thread!");

  const directoryMsg = await directoryChannel.send(newChannelEmbed);
  directoryMsg.react("✔️");

  //I update them because I am awaiting when I send the message, and I want to make sure that I have all the most recent values
  const updatedThreads = updateThreads(message);
  const pastIds = updatedThreads.thread.id;

  updatedThreads.thread.directoryEntry = directoryMsg.id;
  updatedThreads.thread.id = [...pastIds, directoryMsg.id];

  const index = updatedThreads.threads.indexOf(updatedThreads.thread);

  await db.set(`instanced.${message.guild.id}`, updatedThreads.threads);

  message.channel.send({
    embed: {
      color: 0xff9f01,
      description: "I successfully made this thread public!",
    },
  });
};

function isValid(message, threads) {
  if (!threads) {
    message.channel.send({
      embed: {
        color: 0xff9f01,
        description: "You can only use this command in a private thread",
      },
    });
    return;
  }
  const threadObject = threads.find(
    (thread) => thread.newChannel === message.channel.id
  );

  if (!threadObject) {
    message.channel.send({
      embed: {
        color: 0xff9f01,
        description: "You can only use this command in a private thread",
      },
    });
    return;
  }
  if (threadObject.directoryMsg) {
    message.channel.send({
      embed: {
        color: 0xff9f01,
        description: "You can only use this command in a private thread",
      },
    });
    return;
  }

  return true;
}

function updateThreads(message) {
  const threads = db.get(`instanced.${message.guild.id}`);
  const thread = threads.find(
    (thread) => thread.newChannel === message.channel.id
  );
  return { threads: threads, thread: thread };
}
exports.help = {
  name: "convertpublic",
  description: "Converts a private thread to public",
  usage: "convertpublic",
  example: "convertpublic",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
