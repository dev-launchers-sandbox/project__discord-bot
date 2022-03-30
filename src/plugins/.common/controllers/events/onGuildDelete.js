const dbh = require("./../../structures/DataHandling/DatabaseHandler.js");

exports.eventHandle = "guildDelete";
exports.event = async (client, guild) => {
  dbh.guild.deleteGuild(guild.id);
};
