exports.help = {
  name: "test",
  description: "Displays information about the server",
  usage: "serverinfo",
  example: "serverinfo",
};

exports.conf = {
  aliases: ["server", "si"],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  const member = message.guild.members.resolve("643624686420492340");
  const channel = message.guild.channels.resolve(
    message.member.lastMessageChannelID
  );
  const msg = await channel.fetch(member.lastMessageID);
  console.log(msg.createdAt);
};
