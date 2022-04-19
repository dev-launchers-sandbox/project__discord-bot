const Opportunity = require("./../../structures/Opportunity.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

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
  const opportunityChannelId = await dbh.channels.getOpportunity(guild.id);
  const opportunityChannel = guild.channels.resolve(opportunityChannelId);
  if (!opportunityChannel) return author.send("Coming Soon!");
  const opportunity = new Opportunity(client, author, guild);
  opportunity.createOpportunity();
};
