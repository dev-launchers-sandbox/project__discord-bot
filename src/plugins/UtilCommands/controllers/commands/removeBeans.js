

exports.help = {
  name: "removeBeans",
  description: "Removes the beans from a player",
  usage: "removeBeans <id>",
  example: "removeBeans 63624686420492340",
};

exports.conf = {
  aliases: ["reacto", "react"],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
  arguments: ["User"],
};

exports.run = async (client, message, args) => {
  const id = args[0] || "-";
  db.delete(`account.${id}.devBeans`);
  db.delete(`account.${id}.goldenBeans`);
  message.channel.sendEmbed({
    color: 0xff9f01,
    description: `Deleted user <@${id}>`,
  });
};
