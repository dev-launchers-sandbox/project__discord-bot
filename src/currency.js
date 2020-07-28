const db = require("quick.db");
const Discord = require("discord.js");
let ms = require("parse-ms");

module.exports = {
  // get and display the currency balance of any user
  balance: function(message, args) {
    // determine user to inquire balance
    let userBalance; // user object
    // if another username is specified, get the balance of that user
    if (message.mentions.users.first()) {
      userBalance = message.mentions.users.first();
      // default to the user calling the command
    } else {
      userBalance = message.author;
    }
    // if the user if a bot, call it out
    if (userBalance.bot) {
      return message.channel.send("This user is a bot!");
    }
    // access user specific balance
    let balance = db.get(`account.${userBalance.id}.balance`);
    if (!balance) balance = 0; // if there is no balance object, set to 0

    // format balance output message
    const embed = new Discord.MessageEmbed()
      .setColor(0xff9f01)
      .setTitle(`**${userBalance.tag}** Balance`)
      .addField("Balance", `$${balance}`)
      .setThumbnail(userBalance.displayAvatarURL({ size: 4096, dynamic: true }))
      //setting the size and allowing profile pictures to be .gif
      .setTimestamp(new Date());
    message.channel.send(embed);
  },

  // users can use the daily command every 24 hrs to receive a set amount of
  // Dev Coin
  daily: async function(message, args) {
    //
    let pad_zero = num => (num < 10 ? "0" : "") + num;
    let cooldown = 8.64e7;
    let amount = 50;
    // check the time when the user last ran the daily command
    let lastDaily = await db.get(`lastDaily.${message.author.id}`);
    let timeObj;

    //
    try {
      if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
        timeObj = ms(cooldown - (Date.now() - lastDaily));
        let hours = pad_zero(timeObj.hours).padStart(2, "0"),
          minutes = pad_zero(timeObj.minutes).padStart(2, ""),
          seconds = pad_zero(timeObj.seconds).padStart(2, "");
        let finalTime = `**${hours}:${minutes}:${seconds}**`;
        return message.channel.send(`You need to wait ${finalTime} `);
      } else {
        db.set(`lastDaily.${message.author.id}`, Date.now());
        db.add(`account.${message.author.id}.balance`, amount);
        return message.channel.send(
          `Great **${message.author.tag}**, you have received **50** coins`
        );
      }
    } catch (error) {
      console.log(error);
      return message.channel.send(
        `Something went wrong! Try again or wait a few seconds`
      );
    }
  },
  awardPoints: async function(message) {
    let cooldown = 60000; //1 minute
    let amount = 1; //points awarded
    //get the last time the user got points for sending a message
    let lastActivityPoints = await db.get(
      `lastActivityPoints.${message.author.id}`
    );
    try {
      if (
        lastActivityPoints !== null &&
        cooldown - (Date.now() - lastActivityPoints) > 0
      ) {
        //if the user has sent a awarded message (received points) in the past 59s it will exit out of the function
        return;
      } else {
        //set lastActivityPoints to the moment when the user received the points
        db.set(`lastActivityPoints.${message.author.id}`, Date.now());
        //add the corresponding amount into their account(1)
        db.add(`account.${message.author.id}.balance`, amount);
      }
    } catch (error) {
      console.log(error);
    }
  },
  buy: async function(message, args) {
    let itemToBuy = args[1];
    let userBalance = db.get(`account.${message.author.id}.balance`);
    let userInventory = db.get(`account.${message.author.id}.inventory`);
    if (itemToBuy === undefined) itemToBuy = "No Item Provided";
    if (itemToBuy === "blue" || "red") {
      if (userBalance < 500)
        return message.channel.send(
          `**${
            message.author.username
          }**, you do not have enough points to buy this!`
        );
      try {
        if (
          userInventory !== undefined &&
          userInventory.find(role => role === itemToBuy)
        ) {
          return message.channel.send(
            `**${
              message.author.username
            }**, you already have the role you are trying to buy`
          );
        }
        db.subtract(`account.${message.author.id}.balance`, 500);
        await db.push(`account.${message.author.id}.inventory`, itemToBuy);
        console.log(db.get(`account.${message.author.id}.inventory`));
        message.channel.send(
          `${message.author.username}, you successfully bought the blue role`
        );
      } catch (err) {
        console.log(`${message.author.id} had an issue buying ${itemToBuy}`);
        message.channel.send(
          "Oops, for some reason I could not add the role to your inventory"
        );
        console.log(err);
      }
    } else {
      let errorEmbed = new Discord.MessageEmbed()
        .setColor("#b80a00")
        .setAuthor("I could not find the item provided!")
        .setDescription(
          `The item you tried to buy does not exist!` +
            " See `.shop` to see the existing items!"
        )
        .setTimestamp();
      message.channel.send(errorEmbed);
    }
  }
  //daily: function(bot, message, args) {},

  /* users can use the convert command to check to conversion value of Dev Points
   into any other currency. Dev Points have 0 real world value so the result
   will always be 0. Unless the user converts their balance into  ApprecKrisiation
   points. This value will always be 1.
  */
  //convert: function(bot, message, args) {}
};
