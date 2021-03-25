const Discord = require("discord.js");

exports.help = {
  name: "createInvite",
  description: "Creates a unique invite any channel specified.",
  usage: ".createInvite <#channel> ",
  example: ".createInvite #our-server",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["Channel"],
};
exports.run = async (client, message, args) => {
  const channel = message.mentions.channels.first();
  channel
    .createInvite({ unique: true, maxAge: 0 })
    .then((invite) =>
      message.channel.sendEmbed({
        color: 0xff9f01,
        description: `Invite Created! Code: **${invite.code}**`,
      })
    );
};
