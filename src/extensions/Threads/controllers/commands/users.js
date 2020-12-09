const Discord = require("quick.db");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  const channelsCreated = db.get(`instanced.${message.guild.id}`);
  if (!channelsCreated) {
    message.channel.send({
      embed: { color: 0xff9f01, description: "This channel is not a thread!" },
    });
  }
  const threadObject = channelsCreated.find(
    (channel) => channel.newChannel === message.channel.id
  );

  if (!threadObject) {
    message.channel.send({
      embed: { color: 0xff9f01, description: "This channel is not a thread!" },
    });
    return;
  }

  const roleId = threadObject.role;
  const role = message.guild.roles.resolve(roleId);

  if (!role) {
    message.channel.send({
      embed: { color: 0xff9f01, description: "There was an unexpected error!" },
    });
    return;
  }
  const userCount = role.members.size;

  message.channel.send({
    embed: {
      color: 0xff9f01,
      description: `There ${
        userCount === 1 ? `is 1 user` : `are ${userCount} users`
      } in this thread!`,
    },
  });
};

exports.help = {
  name: "users",
  description: `Shows the number of users in a thread`,
  usage: "users",
  example: "users",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};
