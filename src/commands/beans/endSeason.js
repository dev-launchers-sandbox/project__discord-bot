const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  message.channel.send(
    `**${message.author.username}**, do you want to end the bean season? ` +
      "`Y`, `N`"
  );
  const collector = message.channel.createMessageCollector(
    (m) =>
      m.author.id === message.author.id &&
      (m.content === "Y" || m.content === "N"),
    { time: 7000, max: 1 }
  );
  collector.on("collect", (msg) => {
    try {
      if (msg.content === "Y") {
        message.guild.members.cache.forEach((member) => {
          db.delete(`account.${member.user.id}.devBeans`);
          db.delete(`account.${member.user.id}.goldenBeans`);
          db.delete(`lastGoldenBean.${member.user.id}`);
          db.delete(`lastGoldenBeanAwarded.${member.user.id}`);
        });
        message.channel.send(
          `**${message.author.username}**, I successfully ended the bean season`
        );
      } else if (msg.content === "N") {
        return msg.channel.send(`**${msg.author.username}**, Okay!`);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(
        `**${msg.author.username}**, I could not end the season! Try again later...!`
      );
    }
  });
  collector.on("end", (collected) => {
    if (collected.size === 0) {
      message.channel.send(
        `**${message.author.username}**, you took too long to answer!`
      );
    }
  });
};

exports.help = {
  name: "endseason",
  description: "Ends the current bean season",
  usage: `-endSeason`,
  example: `-endSeason`,
};

exports.conf = {
  aliases: ["end"],
  cooldown: 5,
};
