const Discord = require("discord.js");

const bot = new Discord.Client();

const moment = require("moment");

const dateformat = require("dateformat");

const PREFIX = "!";
//Channels IDs:
let countChannel = {
  total: process.env.COUNT_CHANNEL_TOTAL,
  members: process.env.COUNT_CHANNEL_MEMBERS,
  bots: process.env.COUNT_CHANNEL_BOTS
};
// Roles IDs:
const whiteBelt = process.env.WHITE_BELT;
const interests = process.env.INTERESTS;

//When the bot is ready it will let us know.
bot.on("ready", () => {
  console.log("Connected as " + bot.user.tag);
});

// When a user joins it will run the following code.
bot.on("guildMemberAdd", member => {
  updateCounters(member);
  setUpNewMembers(member);
});
// When a user leaves the guild (server) the following code will run.
bot.on("guildMemberRemove", member => {
  updateCounters(member);
});
//When someone sends a message it will run the following code.
bot.on("message", message => {
  //If the message doesn’t start with the prefix (!), we don’t want the bot to do anything, so we just return.
  if (!message.content.startsWith(PREFIX)) {
    return;
  }
  //This creates the constant args which holds the message sent - the prefix.
  let args = message.content.substring(PREFIX.length).split(" ");
  switch (args[0]) {
    //Help command: This explains all of the commands. It contains 2 pages.
    case "help":
      sendHelpEmbed(message, args);
      break;

    //Clear commmand: Clears (deletes) the number of messages specified by whoever ran the command.
    case "clear":
      clearMessages(message, args);
      break;

    //Command Kick: Kicks a the user from the server specified by whoever ran the command.
    case "kick":
      kickMember(message, args);
      break;

    //Command Ban: Bans a the user from the server specified by whoever ran the command.
    case "ban":
      banMember(message, args);
      break;

    //Creates a simple yes or no poll. The content of the poll is specified by whoever ran the command.
    case "poll":
      createPoll(message, args);
      break;

    //Command Info: Sends an embed containing the information of a U  ser in the guild (server).
    // Whoever runs the command specifies who the User is.
    case "info":
      displayInfo(message);
      break;
    //Command Update Counters: Updates the server stats
    case "updateCounters":
      updateCounters(message);
      break;
    // Command Server Info: Displays informations about the server (members, channels, owner, etc.)
    case "serverinfo":
      displayServerInfo(message);
      break;
    default:
      return;
  }
});
bot.login(process.env.DISCORD_TOKEN);

/**
 * @function updateCounters
 * @description Updates the server stats.
 * @param {Discord.GuildMember} member Member who joined or left the guild.
 * @param {Discord.Message} message The message sent to call this command.
 */
function updateCounters(member, message) {
  const server = message || member;
  bot.channels.cache
    .get(countChannel.total)
    .setName(`Total Members: ${server.guild.memberCount}`);

  //This updates the membes counter by setting it to the server’s member count.
  bot.channels.cache
    .get(countChannel.members)
    .setName(
      `Members: ${server.guild.members.cache.filter(m => !m.user.bot).size}`
    );

  //This updates the bot counter by setting it to the server’s bot count.
  bot.channels.cache
    .get(countChannel.bots)
    .setName(
      `Bots: ${server.guild.members.cache.filter(m => m.user.bot).size}`
    );
}
/**
 * @function setUpNewMembers
 * @description Sends an embed letting everyone know someone joined and it assigns the member some roles
 * @param {Discord.GuildMember} member Member who joined the guild.
 */
function setUpNewMembers(member) {
  //Gets the channel where we want to send an embed.
  const welcomeChannel = member.guild.channels.cache.find(
    channel => channel.name === "general"
  );
  // If a channel with the name "general", we just want to return.
  if (!welcomeChannel) return;
  const welcomingEmbed = new Discord.MessageEmbed()
    .setTitle(member.user.username + " joined!")
    .setThumbnail(member.user.displayAvatarURL())
    .addField(`Member Number ${member.guild.memberCount}!`);
  member.send(
    "Welcome to DevLaunchers! To access all of the channels in the server please click the checkbox on the readme channel! If you have any questions, please DM a moderator."
  );
  //Adds the roles we want every member to have upon arrival.
  member.roles.add(whiteBelt);
  member.roles.add(interests);
  welcomeChannel.send(welcomingEmbed);
}

function sendHelpEmbed(message, args) {
  //This checks if the page specified is the 1st one.
  if (!args[1] || args[1] === "1") {
    const helpEmbed_1 = new Discord.MessageEmbed()
      .setTitle("Page 1")
      .addField(
        "Help",
        "Where you are! You can change the page by calling help + [pg num.]"
      )
      .addField("Clear", "Deletes the number of messages you specify.")
      .setFooter("Page 1-3")
      .setColor(0xff9f01);
    message.channel.send(helpEmbed_1);
  }
  //This checks if the page specified is the 1st one.
  if (args[1] === "2") {
    const helpEmbed_2 = new Discord.MessageEmbed()
      .setTitle("Page 2")
      .addField("Kick", "Kicks the member you specify!")
      .addField("Ban", "Bans the member you specify!")
      .addField("Poll", "Start a simple yes or no poll!")
      .setColor(0xff9f01)
      .setFooter("Page 2-3");
    message.channel.send(helpEmbed_2);
  }
  if (args[1] === "3") {
    const helpEmbed_3 = new Discord.MessageEmbed()
      .setTitle("Page 3")
      .addField(
        "Info",
        "Displays the info of whoever sent the message, or whoever you specify."
      )
      .addField("Serverinfo", "Displays information about the server.")
      .setColor(0xff9f01)
      .setFooter("Page 3-3");
    message.channel.send(helpEmbed_3);
  }
}

function clearMessages(message, args) {
  //Checks if the user who ran the command has the permissions to manage messages.
  // This prevents users having control over things their discords permissions don’t allow them to do.
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply("You do not have the permissions to do this!");

  // If there isn’t a specified amount of messages to delete, the bot tells you
  if (!args[1])
    return message.reply(
      "Please specify how many messages you want to delete!"
    );
  // The amount of messages to removes comes as a string. This changes it into an int.
  const messagesToDelete = parseInt(args[1], 10);
  // We want to also delete the command so we need to add 1 to the messagesToDelete.
  message.channel.bulkDelete(messagesToDelete + 1);
}

function kickMember(message, args) {
  //Checks if the user who ran the command has the permissions to kick members.
  // This prevents users having control over things their discords permissions don’t allow them to do.
  if (!message.member.permissions.has("KICK_MEMBERS"))
    return message.reply("You do not have the permissions to do this!");
  // If there isn’t a user to kick specified the bot tells you.
  if (!args[1])
    return message.channel.send("You need to specify who you want to kick!");
  const user = message.mentions.users.first();
  if (user) {
    // Checks if the user is trying to kick itself.
    if (user === message.author)
      return message.reply(`You cannot kick yourself `);
    const member = message.guild.member(user);
    if (member) {
      member
        .kick("You where kicked from the server")
        .then(() => {
          message.reply(`I successfully kicked ${user.tag}`);
        })
        .then(member.send("You were kicked from DevLaunchers for"))
        .catch(err => {
          if (member.guild) {
            message.reply("I was unable to kick the member");
          } else {
            message.reply(`I successfully kicked ${user.tag}`);
          }

          console.log(err);
        });
    }
  }
}

function banMember(message, args) {
  //Checks if the user who ran the command has the permissions to ban members.
  // This prevents users having control over things their discords permissions don’t allow them to do.
  if (!message.member.permissions.has("BAN_MEMBERS"))
    return message.reply("You do not have the permissions to do this!");
  // If there isn’t a user to kick specified the bot tells you.
  if (!args[1])
    return message.channel.send("You need to specify who you want to ban!");
  const userToBan = message.mentions.users.first();
  if (userToBan) {
    if (userToBan === message.author)
      return message.reply(`You cannot ban yourself `);
    const memberToBan = message.guild.member(userToBan);
    if (memberToBan) {
      memberToBan
        .ban("You where banned from the server")
        .then(() => {
          message.reply(`I successfully banned ${userToBan.tag}`);
        })
        .then(memberToBan.send("You were banned from DevLaunchers"))
        .catch(err => {
          message.reply(`I successfully banned ${userToBan.tag}`);
        });
    }
  }
}
function createPoll(message, args) {
  //Checks if the user who ran the command has the permissions to manage members.
  // This prevents users having control over things their discords permissions don’t allow them to do.
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply("You do not have the permissions to do this!");
  message.channel.bulkDelete(1);
  const pollHelpEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle("Initialite Poll")
    .setDescription(
      "!p or !poll followed by the question to create simple yes or no poll"
    );
  if (!args[1]) {
    message.channel.send(pollHelpEmbed);
    return;
  }
  let messageArgs = args.slice(1).join(" ");

  const PollEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTitle("Poll initated by " + message.author.username)
    .setDescription("📝 " + "**" + messageArgs + "**");
  message.channel.send(PollEmbed).then(msgReaction => {
    msgReaction.react("👍");
    msgReaction.react("👎");
  });
}

function displayInfo(message) {
  let userInfo = message.mentions.users.first() || message.author;

  if (userInfo.presence.status === "dnd")
    userInfo.presence.status = "Do Not Disturb";
  if (userInfo.presence.status === "idle") userInfo.presence.status = "Idle";
  if (userInfo.presence.status === "offline")
    userInfo.presence.status = "Offline";
  if (userInfo.presence.status === "online")
    userInfo.presence.status = "Online";

  let createdate = moment
    .utc(userInfo.createdAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let joindate = moment
    .utc(userInfo.joinedAt)
    .format("dddd, MMMM Do YYYY, HH:mm:ss");

  let status = userInfo.presence.status;
  let avatar = userInfo.avatarURL({ size: 2048 });

  const infoEmbed = new Discord.MessageEmbed()
    .setAuthor(userInfo.tag, avatar)
    .setThumbnail(avatar)
    .setTimestamp()
    .setColor(0xff9f01)
    .addField("ID", userInfo.id, true)
    .addField("Created Account Date", `${createdate}`, true)
    .addField("Joined Server Date", `${joindate}`)
    .addField("Status", status, true);
  message.channel.send(infoEmbed);
}
function displayServerInfo(message) {
  let icon = message.guild.iconURL({ size: 2048 });
  let region = {
    brazil: "Brazil",
    "eu-central": "Central Europe",
    singapore: "Singapore",
    london: "London",
    japan: "Japan",
    hongkong: "Hongkong",
    sydney: "Sydney",
    russia: "Russia",
    "us-central": "U.S. Central",
    "us-east": "U.S. East",
    "us-south": "U.S. South",
    "us-west": "U.S. West",
    "eu-west": "Western Europe"
  };

  let member = message.guild.members;
  let offline = member.cache.filter(m => m.user.presence.status === "offline")
      .size,
    online = member.cache.filter(m => m.user.presence.status === "online").size,
    idle = member.cache.filter(m => m.user.presence.status === "idle").size,
    dnd = member.cache.filter(m => m.user.presence.status === "dnd").size,
    bots = member.cache.filter(m => m.user.bot).size,
    total = message.guild.memberCount;

  let channels = message.guild.channels;
  let text = channels.cache.filter(r => r.type === "text").size,
    vc = channels.cache.filter(r => r.type === "voice").size,
    category = channels.cache.filter(r => r.type === "category").size,
    totalchan = channels.cache.size;

  let location = region[message.guild.region];

  let created = dateformat(message.guild.createdAt);

  const serverInfoEmbed = new Discord.MessageEmbed()
    .setColor(0xff9f01)
    .setTimestamp(new Date())
    .setThumbnail(icon)
    .setAuthor(message.guild.name, icon)
    .setDescription(`ID: **${message.guild.id}**`)
    .addField("Region", location)
    .addField("Created On", `${created} `)
    .addField(
      "Owner",
      `**${message.guild.owner.user.tag}** \n\`${message.guild.owner.user.id}\``
    )
    .addField(
      `Members [${total}]`,
      `Online: ${online} \nIdle ${idle} \nDND: ${dnd} \nOffline ${offline} \nBots: ${bots}`
    )
    .addField(
      `Channels [${totalchan}]`,
      `Text: ${text} \nVoice: ${vc} \nCategory: ${category}`
    );
  message.channel.send(serverInfoEmbed);
}
