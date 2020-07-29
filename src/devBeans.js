const db = require("quick.db");
const Discord = require("discord.js");
let ms = require("parse-ms");

// quickdb uses json.sqlite file in current folder as storage

module.exports = {
  awardDevBean: async function (messageReaction, user) {
    //if the user does not react with the correct emoji, we do not want to do anything
    if (messageReaction.emoji.name !== "DevBean") return;
    let userToGiveBeansTo = messageReaction.message.author.id; //id of the users whos message got a reaction
    let userWhoReacted = user.id; //user that reacted
    //if there were any bots involved in the message we do not want to continue
    let cooldown = 60000;
    let pad_zero = num => (num < 10 ? "0" : "") + num; //do not ask me what this does
    let timeObj;
    let lastDevBean = db.get(`lastDevBean.${user.id}`);
    if (user.bot || messageReaction.message.author.bot) return;
    //if the user reaction to his own message he will not get a devBean
    if (userToGiveBeansTo === userWhoReacted) return;
    try {
      if (lastDevBean !== null && cooldown - (Date.now() - lastDevBean) > 0) {
        timeObj = ms(cooldown - (Date.now() - lastDevBean));
        let seconds = pad_zero(timeObj.seconds).padStart(2, "");
        let finalTime = `**${seconds} second(s)**`;
        messageReaction.message.reactions.cache.first().remove(user.id);
        return user.send(`You need to wait ${finalTime} `);
      } else {
        db.set(`lastDevBean.${user.id}`, Date.now());
        db.add(`account.${userToGiveBeansTo}.devBeans`, 1);
        user.send(
          `Dev Bean added to **${messageReaction.message.author.tag}** balance!`
        );
      }
    } catch (err) {
      //if there is an error, send an "error" message
      user.send(
        "Oopsie, for some reason I could not award the user with the dev-bean"
      );
    }
  },
  removeBean: async function (messageReaction, user) {
    //if the user did not unreact with the correct emoji, we do not want to do anything
    if (messageReaction.emoji.name !== "DevBean")
      return console.log("not beans");
    let userToRemoveBeansTo = messageReaction.message.author; //id of the users whos message got a reaction
    let userWhoReacted = user.id; //user that reacted

    //if there were any bots involved in the message we do not want to continue
    if (user.bot || userToRemoveBeansTo.bot) return;
    //if the user reaction to his own message he will not get a devBean
    if (userToRemoveBeansTo.id === userWhoReacted) return;
    try {
      db.subtract(`account.${userToRemoveBeansTo.id}.devBeans`, 1); //subtract the amount of beans
      user.send(
        `Dev-Bean removed from **${messageReaction.message.author.tag}**`
      );
    } catch (err) {
      //if there is an error, send an "error" message
      user.send(
        "Oopsie, for some reason I could not remove a dev-bean from the user"
      );
    }
  },
  awardGoldenBean: async function (messageReaction, user) {
    //if there were any bots involved in the message we do not want to continue
    if (user.bot || messageReaction.message.author.bot) return;
    //if the user does not react with the correct emoji, we do not want to do anything
    if (messageReaction.emoji.name !== "GoldenBean") return;
    //if the user is not an admininstrator, we do not want to award the user with a golden bean
    let userToGiveGoldenBeansTo = messageReaction.message.author.id; //id of the users whos message got a reaction
    let userWhoReacted = user.id; //user that reacted
    let cooldown = 8.64e7;
    let pad_zero = num => (num < 10 ? "0" : "") + num; //do not ask me what this does
    //if the user reaction to his own message he will not get a devBean
    if (userToGiveGoldenBeansTo === userWhoReacted) return;
    let lastGoldenBean = db.get(`lastGoldenBean.${user.id}`);
    let timeObj;
    try {
      if (
        lastGoldenBean !== null &&
        cooldown - (Date.now() - lastGoldenBean) > 0
      ) {
        timeObj = ms(cooldown - (Date.now() - lastGoldenBean));
        let hours = pad_zero(timeObj.hours).padStart(2, "0"),
          minutes = pad_zero(timeObj.minutes).padStart(2, "");
        let finalTime = `**${hours} hour(s) and ${minutes} minute(s)**`;
        messageReaction.message.reactions.cache.first().remove(user.id);
        return user.send(`You need to wait ${finalTime} `);
      } else {
        db.set(`lastGoldenBean.${user.id}`, Date.now());
        db.add(`account.${userToGiveGoldenBeansTo}.goldenBeans`, 1);
        user.send(
          `Golden Bean added to **${
          messageReaction.message.author.tag
          }** balance!`
        );

        return db.set(
          `lastGoldenBeanAwarded.${user.id}`,
          messageReaction.message.id
        );
      }
    } catch (err) {
      //if there is an error, send an "error" message
      user.send(
        "Oopsie, for some reason I could not award the user with the golden-bean"
      );
      console.log(err);
    }
  },
  removeGoldenBean: async function (messageReaction, user) {
    //if the user does not "unreact" with the correct emoji, we do not want to do anything
    if (messageReaction.emoji.name !== "GoldenBean") return;
    let lastGoldenBeanAwarded = db.get(`lastGoldenBeanAwarded.${user.id}`);
    //if the user is not an admininstrator, we do not want to award the user with a golden bean
    let userToGiveGoldenBeansTo = messageReaction.message.author.id; //id of the users whos message got an "unreaction"
    let userWhoReacted = user.id; //user that "unreacted"
    //if there were any bots involved in the message we do not want to continue
    if (user.bot || messageReaction.message.author.bot) return;
    //if the user unreacted to his own message he will not get a devBean
    if (userToGiveGoldenBeansTo === userWhoReacted) return;
    if (lastGoldenBeanAwarded !== messageReaction.message.id) {
      console.log("lastGoldenBeanAwarded = ", lastGoldenBeanAwarded);
      console.log("messageReaction.message.id =", messageReaction.message.id);
      return user.send(
        `**${
        user.username
        }**, you can only remove the last golden-bean you awarded!`
      );
    }
    try {
      db.subtract(`account.${userToGiveGoldenBeansTo}.goldenBeans`, 1); //remove the amount of golden-beans
      db.delete(`lastGoldenBean.${user.id}`);
      user.send(
        `Golden-Bean removed from **${messageReaction.message.author.tag}**`
      );
    } catch (err) {
      //if there is an error, send an "error" message
      user.send(
        "Oopsie, for some reason I could not remove a golden-bean from the user"
      );
    }
  },
  getBeans: function (message, args) {
    // determine user to inquire balance
    let userDevBeans; // user object
    // if another username is specified, get the balance of that user
    if (message.mentions.users.first()) {
      userDevBeans = message.mentions.users.first();
      // default to the user calling the command
    } else {
      userDevBeans = message.author;
    }
    // if the user if a bot, call it out
    if (userDevBeans.bot) {
      return message.channel.send(
        "Bots do not have a balance. They will **always have infinite beans.**"
      );
    }
    // access user specific balance
    let devBeans = db.get(`account.${userDevBeans.id}.devBeans`);
    let avatar = userDevBeans.avatarURL({ size: 2048 }); //userDevBeans avatar
    let devBeanEmoji = message.guild.emojis.cache.find(
      emoji => emoji.name === "DevBean"
    );
    let goldenBeanEmoji = message.guild.emojis.cache.find(
      emoji => emoji.name === "GoldenBean"
    );
    if (!devBeans) devBeans = 0; // if there is no balance object, set to 0
    let goldenBeans = db.get(`account.${userDevBeans.id}.goldenBeans`);
    if (!goldenBeans) goldenBeans = 0;
    // format balance output message
    const embed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setAuthor(`${userDevBeans.tag} DevBeans Balance`, avatar)
      .addField("Dev-Beans", `${devBeans} Dev Bean(s) ${devBeanEmoji}`)
      .addField(
        "Golden-Beans",
        `${goldenBeans} Golden Bean(s) ${goldenBeanEmoji}`
      )
      .setTimestamp(new Date());
    message.channel.send(embed);
  },
  endSeason: function (message, args) {
    message.channel.send(
      `**${message.author.username}**, do you want to end the bean season? ` +
      "`Y`, `N`"
    );
    const collector = message.channel.createMessageCollector(
      m =>
        m.author.id === message.author.id &&
        (m.content === "Y" || m.content === "N"),
      { time: 7000, max: 1 }
    );
    collector.on("collect", msg => {
      try {
        if (msg.content === "Y") {
          message.guild.members.cache.forEach(member => {
            db.delete(`account.${member.user.id}.devBeans`);
            db.delete(`account.${member.user.id}.goldenBeans`);
            db.delete(`lastGoldenBean.${member.user.id}`);
            db.delete(`lastGoldenBeanAwarded.${member.user.id}`);
          });
          message.channel.send(
            `**${
            message.author.username
            }**, I successfully ended the bean season`
          );
        } else if (msg.content === "N") {
          return msg.channel.send(`**${msg.author.username}**, Okay!`);
        }
      } catch (error) {
        console.log(error);
        message.channel.send(
          `**${
          msg.author.username
          }**, I could not end the season! Try again later...!`
        );
      }
    });
    collector.on("end", collected => {
      if (collected.size === 0) {
        message.channel.send(
          `**${message.author.username}**, you took too long to answer!`
        );
      }
    });
  },
  leaderboard: async function (bot, message, type) {
    const getUserAccounts = () => {
      let allData = db.all();
      let accounts = allData.filter(data => data.ID === "account")[0].data;
      return accounts;
    };

    const getSortedDevBeansArray = () => {
      Object.keys(accounts).forEach(userID => {
        let account = accounts[userID];
        if (type === "devBeans") {
          if (account.devBeans) {
            lbArray.push({ id: userID, type: account.devBeans });
          }
        } else if (type === "goldenBeans") {
          if (account.goldenBeans) {
            lbArray.push({ id: userID, type: account.goldenBeans });
          }
        }
      });
      lbArray.sort((a, b) => b.type - a.type);
    };
    let lbEmbed;
    let lbArray = [];
    let accounts = getUserAccounts();
    await getSortedDevBeansArray();
    lbEmbed = new Discord.MessageEmbed()
      .setTitle(`${type} Leaderboard`)
      .setTimestamp();

    lbEmbed.setDescription(
      setColorAndDescriptionEmbed(message, lbArray, type).description
    );
    lbEmbed.setColor(setColorAndDescriptionEmbed(message, lbArray, type).color);
    message.channel.send(lbEmbed);
  },
  leaderboardManager: function (bot, message, args) {
    let lbType;
    let goldenBeanEmoji = message.guild.emojis.cache.find(
      emoji => emoji.name === "GoldenBean"
    );
    let devBeanEmoji = message.guild.emojis.cache.find(
      emoji => emoji.name === "DevBean"
    );
    if (!goldenBeanEmoji || !devBeanEmoji) {
      return message.channel.send(
        `**${
        message.author.username
        }**, this server does not have the devBeans and/or goldenBeans emojis!`
      );
    }
    let errorEmbed = new Discord.MessageEmbed()
      .setTitle("Dev Launchers Leaderboards!")
      .setColor(0xff9f01)
      .setDescription(
        "Dev-Beans Leaderboard: `.leaderboard devBeans` \n Golden-Beans Leaderboard: `.leaderboard goldenBeans`"
      )
      .setTimestamp();
    if (!args[1]) {
      message.channel.send(errorEmbed);
    }
    if (
      args[1] === "devBeans" ||
      args[1] === "goldenBeans" ||
      args[1] === "d" ||
      args[1] === "1" ||
      args[1] === "g" ||
      args[1] === "2"
    ) {
      if (args[1] === "d" || args[1] === "1") {
        lbType = "devBeans";
      } else if (args[1] === "g" || args[1] === "2") {
        lbType = "goldenBeans";
      } else {
        lbType = args[1];
      }
      module.exports.leaderboard(bot, message, lbType);
    } else if (args[1]) {
      message.channel.send(errorEmbed);
    }
  }
};

function setColorAndDescriptionEmbed(message, lbArray, type) {
  let description = "";
  let rankOfUser = 1;
  let capitalize = type.charAt(0).toUpperCase() + type.slice(1);
  let emojiWord = capitalize.substring(0, capitalize.length - 1);
  let emoji = message.guild.emojis.cache.find(
    emoji => emoji.name === emojiWord
  );
  let color;
  if (lbArray.length >= 10) lbArray = lbArray.slice(0, 10);
  if (lbArray.length !== 0) {
    lbArray.forEach(userEntrie => {
      let userObject = message.guild.members.cache.get(userEntrie.id);
      let addWord = `**${rankOfUser}) ${userObject.user.tag}: ${
        userEntrie.type
        }** ${emoji} \n`;
      description = description.concat(addWord);
      rankOfUser = rankOfUser + 1;
    });
    color = 0xff9f01;
  } else {
    color = "b80a00";
    description = `No one has any ${type} yet!`;
  }
  return { description, color };
}
