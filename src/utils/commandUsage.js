const Discord = require("discord.js");


module.exports = {
  noPerms: function (message, missingPermission) {
    let icon = message.guild.iconURL();
    let missingPermissionEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("Missing Permissions!")
      .setDescription(
        `You cannot run this command! You are missing **${missingPermission}**`
      )
      .setFooter(`|  ${message.guild.name}`, icon);
    message.channel.send(missingPermissionEmbed);
  },

  missingParams: async function (message, missingParams, commandName) {
    let prefix = (await db.get(`prefix.${message.guild.id}`)) || ".";
    let missingParamsEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("Missing Parameters!")
      .setDescription(`You are missing: **${missingParams}**`)
      .setFooter(`For further help, type ${prefix}help ${commandName}`);
    message.channel.send(missingParamsEmbed);
  },

  error: function (message, commandName, errorDescription) {
    let errorEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("There was an error!")
      .setDescription(
        errorDescription ||
          `There was an unexpected error while running the ${commandName} command`
      )
      .setTimestamp();
    message.channel.send(errorEmbed);
  },

  deleteMsg: function (message, miliseconds) {
    if (!miliseconds) miliseconds = 3000;
    setTimeout(() => {
      message.delete();
    }, miliseconds);
  },
};
