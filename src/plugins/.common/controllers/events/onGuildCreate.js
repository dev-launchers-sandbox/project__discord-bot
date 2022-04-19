const dbh = require("./../../structures/DataHandling/DatabaseHandler.js");

exports.eventHandle = "guildCreate";
exports.event = async (client, guild) => {
  dbh.guild.createGuild(guild.id);
};
