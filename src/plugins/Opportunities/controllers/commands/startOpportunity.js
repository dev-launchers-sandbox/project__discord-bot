const Opportunity = require("./../../structures/Opportunity.js");
const db = require("quick.db");

exports.help = {
  name: "startOpportunity",
  description: "Starts the Opportunity Creation Guide",
  usage: "startOpportunity",
  example: "startOpportunity",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: [],
  isSubCommand: true,
};

exports.run = async (client, message, args) => {
  const { author, guild } = message;
  const opportunityChannelId = db.get(`opportunity.${guild.id}`);
  const opportunityChannel = guild.channels.resolve(opportunityChannelId);
  if (!opportunityChannel) author.send("Coming Soon!");

  const opportunity = new Opportunity(client, author, guild);
  opportunity.createOpportunity();
};
