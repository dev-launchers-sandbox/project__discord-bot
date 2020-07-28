const Discord = require("discord.js");

module.exports = {
  helpManager: function(bot, message, args) {
    let avatar = bot.user.displayAvatarURL({ size: 2048 });

    let helpEmbed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setThumbnail(bot.user.displayAvatarURL())
      .setTimestamp();
    if (!args[1]) {
      helpEmbed
        .setAuthor("Help Command Guide", avatar)
        .addFields(
          { name: "Administrator Only", value: "`.help admin`" },
          { name: "Beans", value: "`.help beans`" },
          { name: "Instanced Channels", value: "`.help instanced`" },
          { name: "Other", value: "`.help other`" }
        );
    }
    if (args[1] === "admin") {
      helpEmbed.setAuthor("Admin Commands Guide", avatar).addFields(
        {
          name: "Kick",
          value: "`Kicks the member you specify | .kick @user `"
        },
        { name: "Ban", value: "`Bans the member you specify | .ban @user `" },
        {
          name: "Clear",
          value: "`Clears the messages you specify | .clear [num] `"
        },
        {
          name: "Poll",
          value: "`Creates a simple (too simple) poll | .poll [question] `"
        },
        {
          name: "TeamsRules",
          value: "`Displays the rules for teams&projects | .teamsRules `"
        }
      );
    } else if (args[1] === "beans" || args[1] === "bean") {
      let DevBeanEmoji = message.guild.emojis.cache.find(
        emoji => emoji.name === "DevBean"
      );
      let GoldenBeanEmoji = message.guild.emojis.cache.find(
        emoji => emoji.name === "GoldenBean"
      );
      helpEmbed.setAuthor("Bean Commands Guide", avatar).addFields(
        {
          name: "Usage",
          value: `If you feel like somebody's message is helpful, nice etc. you can react with either a DevBean ${DevBeanEmoji} or a GoldenBean ${GoldenBeanEmoji}.  DevBeans have a cooldown of 1m while GoldenBeans have a cooldown of 24hrs!`
        },
        {
          name: "Get Beans",
          value: "`Check you bean balance | .getBeans @user`"
        },
        {
          name: "End Season",
          value: "`Admin Only! End the current bean season | .endSeason`"
        },
        {
          name: "Leaderboards",
          value:
            "`Check the leaderboard to see the people with the most beans! | \n.lb goldenBeans,devBeans`"
        }
      );
    } else if (args[1] === "instanced") {
      helpEmbed.setAuthor("Instanced Channels Command Guide", avatar).addFields(
        {
          name:
            "Create Instanced | These channels automatically delete after 12 hour of inactivity",
          value:
            "`Create a new instanced channel | .createInstanced [channelName]`"
        },
        {
          name: "Blacklist",
          value:
            "`Only for admins or the channel creator! Prohibits a user from joining the channel. Use carefully | .blacklist @user`"
        },
        {
          name: "Whitelist",
          value:
            "`You changed your mind about someone? Well, this command whitelists a user | .whitelist @user`"
        },
        {
          name: "invite",
          value:
            "`Create a new invite to the channel you specify | .invite [channel ID]`"
        }
      );
    } else if (args[1] === "other") {
      helpEmbed.setAuthor("Other Commands Guide", avatar).addFields(
        {
          name: "Server Info",
          value: "`Displays info about the server | .serverinfo`"
        },
        {
          name: "Info",
          value: "`Displays info about the user you specify | .info @user`"
        },
        { name: "Help", value: "`Where you are! | .help or .help [type]`" }
      );
    } else if (args[1]) {
      helpEmbed
        .setAuthor("Help Command Guide", avatar)
        .addFields(
          { name: "Administrator Only", value: "`.help admin`" },
          { name: "Beans", value: "`.help bean`" },
          { name: "Instanced Channels", value: "`.help instanced`" },
          { name: "Other", value: "`.help other`" }
        );
    }
    message.channel.send(helpEmbed);
  }
};
/* break into categories
1. Admin Commands: kick, ban, clear, poll, teamsRules
2. Dev Beans: getBeans, endSeason 
3. Instanced Channels: createInstanced, invite, blacklist, whitelist
4. Other: serverinfo, info, help
*/
