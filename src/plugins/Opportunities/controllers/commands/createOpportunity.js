const Opportunity = require("./../../structures/Opportunity.js");

exports.help = {
  name: "createOpportunity",
  description: "Create an opportunity in the #opportunity channel",
  usage: "createOpportunity",
  example: "createOpportunity",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: [],
};

exports.run = async (client, message, args) => {
  const { author } = message;

  const opportunity = new Opportunity(client, author);
  opportunity.createOpportunity();
};
