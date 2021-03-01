exports.help = {
  name: "template",
  description: "The template of a command",
  usage: "template",
  example: "template",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.run = async (client, message, args) => {
  console.log("This is a template");
};
