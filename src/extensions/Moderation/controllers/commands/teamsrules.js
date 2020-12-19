const Discord = require("discord.js");

exports.help = {
  name: "teamsrules",
  description: "Sends a message containing the teams and project rules ",
  usage: "teamsRules",
  example: "teamsRules",
};

exports.conf = {
  aliases: ["teams", "teamrules"],
  cooldown: 5,
  permissions: ["MANAGE_MESSAGES"],
};

exports.run = async (client, message, args) => {
  message.channel.send(
    "**teams-and-projects guidelines:** \n *We'll pin your message if:* \n  - The message has enough detail to be helpful to people who may want to help out with the project, or invite you to theirs \n - The message isn't excessively long (like taking up an entire screen) \n    - The message isn't a verbatim copy of a recent already pinned message \n *We'll remove your message if:* \n - The message takes up too much space \n - The message is spammy or an advertisement \n -You leave the server after posting your message"
  );
};
