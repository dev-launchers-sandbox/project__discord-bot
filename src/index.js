const express = require("express");
const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const promClient = require("prom-client");
const dateformat = require("dateformat");
const metrics = registerMetrics();
const lootboxes = require("./lootboxes");
//const currency = require("./currency");
const devBeans = require("./devBeans");
const help = require("./help");
//const inviteTracker = require("./inviteTracker");
const db = require("quick.db");
//736715831962107924 !!
//736715831962107924
let channelsCreated = [];
startMetricsServer(metrics);

const PREFIX = ".";
//let points = 0;
//Channels IDs:
let countChannel = {
  total: process.env.COUNT_CHANNEL_TOTAL
};
let showcaseChannelID;
let instancedChannelParent;
//When the bot is ready it will let us know.
bot.on("ready", () => {
  setInterval(checkActivity, 60000);
  console.log("Connected as " + bot.user.tag);
  bot.user.setActivity("DevLaunchers  ", { type: "WATCHING" });
  if (bot.user.tag === "DevLaunchers Testing Bot#1408") {
    showcaseChannelID = "720018913143947304";
    instancedChannelParent = "727001197340524575";
    console.log("Alt Bot");
  } else {
    showcaseChannelID = "696792114683445338";
    instancedChannelParent = "733745226082025536";
    console.log("Actual Bot");
  }
  //inviteTracker.fetchInvites(bot);
});
// When a user joins it will run the following code.
bot.on("messageReactionAdd", async (messageReaction, user) => {
  instancedChannelAddRole(messageReaction, user);
  devBeans.awardDevBean(messageReaction, user);
  devBeans.awardGoldenBean(messageReaction, user);
});

bot.on("messageReactionRemove", (messageReaction, user) => {
  devBeans.removeBean(messageReaction, user);
  devBeans.removeGoldenBean(messageReaction, user);
  console.log("messageReactionRemoved");
  if (user.bot) return;
  if (channelsCreated.length === 0) return;
  const messageRole = channelsCreated.find(channel =>
    channel.id.includes(messageReaction.message.id)
  );
  const isRoleActive = messageReaction.message.guild.roles.cache.find(
    role => role.id === messageRole.role
  );
  if (!isRoleActive) {
    console.log("does not have the role");
    return messageReaction.message.channel.send(
      "`" + user.username + "`" + " that channel does not exist anymore"
    );
  }
  if (
    !messageReaction.message.guild.members.cache
      .get(user.id)
      .roles.cache.some(role => role.id === messageRole.role)
  )
    return;
  let channel = bot.channels.cache.get(messageRole.newChannel);

  messageReaction.message.guild.members.cache
    .get(user.id)
    .roles.remove(messageRole.role)
    .then(channel.send("`" + `${user.username}` + "`" + " left the channel!"));
});
bot.on("messageDelete", async message => {
  metrics.events.inc({ event: "message_delete" });
  const auditLogChannel = message.guild.channels.cache.find(
    channel => channel.id === process.env.AUDIT_LOG_CHANNEL_ID
  );
  if (!auditLogChannel) return;
  const messageDeletedEmbed = new Discord.MessageEmbed()
    .setTitle(`A Message By ${message.author.tag} Has Been Deleted!`)
    .addField("Channel", `<#${message.channel.id}>`)
    .addField("Content", message.content)
    .setThumbnail(message.author.displayAvatarURL())
    .setColor(0xff9f01)
    .setTimestamp();
  auditLogChannel.send(messageDeletedEmbed);
});
// dd
bot.on("messageUpdate", (oldMessage, newMessage) => {
  metrics.events.inc({ event: "message_update" });
  const auditLogChannel = oldMessage.guild.channels.cache.find(
    channel => channel.id === process.env.AUDIT_LOG_CHANNEL_ID
  );
  if (!auditLogChannel) return;
  if (!newMessage.content) return;
  if (oldMessage.embeds.length === 0 && newMessage.embeds.length !== 0) {
    return;
  }
  const messageUpdatedEmbed = new Discord.MessageEmbed()
    .setTitle(`${oldMessage.author.tag} has edited one message`)
    .addField("Channel", `<#${oldMessage.channel.id}>`)
    .addField("Old Message", oldMessage.content)
    .addField("New Message", newMessage.content)
    .setThumbnail(oldMessage.author.displayAvatarURL())
    .setTimestamp()
    .setColor(0xff9f01);
  auditLogChannel.send(messageUpdatedEmbed);
});

bot.on("guildMemberAdd", async member => {
  metrics.events.inc({ event: "guild_member_add" });
  updateCounters(member);
  setUpNewMembers(member);
  //inviteTracker.awardInviter(member);
});
// When a user leaves the guild (server) the following code will run.
bot.on("guildMemberRemove", member => {
  metrics.events.inc({ event: "guild_member_remove" });
  updateCounters(member);
  //inviteTracker.removeInviter(member);
});
bot.on("inviteCreate", invite => {
  //inviteTracker.updateInviteFetch(invite);
});
//When someone sends a message it will run the following code.
bot.on("message", async message => {
  if (message.guild === null) return;
  checkIfInstancedChannel(message);
  checkIfInviteCode(message);
  if (message.author.bot) return;
  //currency.awardPoints(message);
  //If the message doesn’t start with the prefix (!), we don’t want the bot to do anything, so we just return.
  if (!message.content.startsWith(PREFIX)) {
    return;
  }
  //This creates the constant args which holds the message sent - the prefix.
  let args = message.content.substring(PREFIX.length).split(" ");
  switch (args[0]) {
    //Help command: This explains all of the commands. It contains 2 pages.
    case "help":
      help.helpManager(bot, message, args);
      metrics.events.inc({ event: "message_help" });
      //sendHelpEmbed(message, args);
      break;
    //Clear commmand: Clears (deletes) the number of messages specified by whoever ran the command.
    case "clear":
      metrics.events.inc({ event: "message_clear" });
      clearMessages(message, args);
      break;

    //Command Kick: Kicks a the user from the server specified by whoever ran the command.
    case "kick":
      metrics.events.inc({ event: "message_kick" });
      kickMember(message, args);
      break;

    //Command Ban: Bans a the user from the server specified by whoever ran the command.
    case "ban":
      metrics.events.inc({ event: "message_ban" });
      banMember(message, args);
      break;

    //Creates a simple yes or no poll. The content of the poll is specified by whoever ran the command.
    case "poll":
      metrics.events.inc({ event: "message_poll" });
      createPoll(message, args);
      break;

    //Command Info: Sends an embed containing the information of a U  ser in the guild (server).
    // Whoever runs the command specifies who the User is.
    case "info":
      metrics.events.inc({ event: "message_info" });
      displayInfo(message);
      break;
    //Command Update Counters: Updates the server stats
    case "updateCounters":
      metrics.events.inc({ event: "message_update_counters" });
      updateCounters(message);
      break;
    // Command Server Info: Displays informations about the server (members, channels, owner, etc.)
    case "serverinfo":
      metrics.events.inc({ event: "message_server_info" });
      displayServerInfo(message);
      break;
    case "roleinfo":
      metrics.events.inc({ event: "message_role_info" });
      sendRoleInfoEmbed(message, args);
      break;

    case "teamsRules":
      metrics.events.inc({ event: "message_teams_rules" });
      sendTeamsRulesMessage(message);
      break;
    case "openWood":
      lootboxes.openWood(message);
      break;
    case "openIron":
      lootboxes.openIron(message);
      break;
    case "openCopper":
      lootboxes.openCopper(message);
      break;
    case "pinMessage":
      if (!args[1]) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            ", you need to provide a message ID"
        );
      }
      let msgToPin;
      message.channel.messages.fetch(args[1]).then(msg => (msgToPin = msg));

      if (msgToPin.pinnable === false) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " this channel has reached the 50 pinned messages mark"
        );
      }
      if (msgToPin.channel.id !== showcaseChannelID) {
        return message.channel.send(
          `You can only use this command in <#${showcaseChannelID}>`
        );
      }
      msgToPin.pin();
      break;
    case "createInstanced":
      createInstancedP1(message, args);
      break;
    case "blacklist":
      console.log("blacklist");
      const messageRole = channelsCreated.find(
        channel => channel.newChannel === message.channel.id
      );
      if (messageRole === undefined)
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " , you cannot blacklist someone from this channel!"
        );
      if (
        !message.member.permissions.has("ADMINISTRATOR") &&
        !message.author.id === messageRole.creator
      ) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " , you do not have the perms to blacklist someone!"
        );
      }
      let userPinged = message.mentions.users.first();
      if (!userPinged) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " please specify a user to blacklist!"
        );
      }
      const userToForceLeave = message.guild.members.cache.get(userPinged.id);
      if (userToForceLeave.permissions.has("ADMINISTRATOR" || "MANAGE_ROLES")) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " you cannot blacklist this user!"
        );
      }
      const isUserBlacklist = messageRole.blacklist.find(
        blacklisted => blacklisted === userToForceLeave.id
      );
      if (isUserBlacklist) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " that user is already blacklisted"
        );
      }
      if (
        userToForceLeave.roles.cache.some(role => role.id === messageRole.role)
      ) {
        userToForceLeave.roles
          .remove(messageRole.role)
          .catch(err => console.err);
      }
      let channel = bot.channels.cache.get(messageRole.newChannel);
      messageRole.blacklist.push(userToForceLeave.user.id);
      channel
        .send(
          "`" +
            userToForceLeave.user.username +
            "`" +
            " has been blacklisted from this channel"
        )
        .then(
          userToForceLeave.send(
            "You have been blacklisted from " + "`" + channel.name + "`"
          )
        );
      break;
    case "whitelist":
      const messageRoles = channelsCreated.find(
        channel => channel.newChannel === message.channel.id
      );
      if (messageRoles === undefined)
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " , you cannot whitelist someone from this channel!"
        );
      const userPing = message.mentions.users.first();
      if (
        !message.member.permissions.has("ADMINISTRATOR") &&
        !message.author.id === messageRoles.creator
      )
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " , you do not have the perms to whitelist someone!"
        );

      if (!userPing) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            " please specify a user to blacklist!"
        );
      }
      const userToWhiteList = message.guild.members.cache.get(userPing.id);
      const isUserBlacklisted = messageRoles.blacklist.find(
        blacklisted => blacklisted === userPing.id
      );
      if (!isUserBlacklisted) {
        return message.channel.send(
          "`" + message.author.username + "`" + " that user is not blacklisted"
        );
      }

      let channelToSend = bot.channels.cache.get(messageRoles.newChannel);
      let index = messageRoles.blacklist.indexOf(userToWhiteList.user.id);
      messageRoles.blacklist.splice(index, 1);
      channelToSend
        .send(
          "`" +
            userPing.username +
            "`" +
            " has been whitelisted from this channel"
        )
        .then(
          userPing.send(
            "You have been whitelisted from " + "`" + channelToSend.name + "`"
          )
        );
      break;
    case "keepChannel":
      if (
        !message.member.permissions.has("ADMINISTRATOR" || "MANAGE_CHANNELS")
      ) {
        return message.channel.send(
          `"` +
            message.author.username +
            "`" +
            "you do not have the perms to do this!"
        );
      }
      const channelToKeep = channelsCreated.find(
        channel => channel.newChannel === message.channel.id
      );
      if (!channelToKeep) {
        return message.channel.send(
          `"` +
            message.author.username +
            "`" +
            "this channel is not an instanced channel!"
        );
      }
      let indexOfChannelToKeep = channelsCreated.indexOf(channelToKeep);
      channelsCreated.splice(indexOfChannelToKeep, 1);
      console.log(channelsCreated);
      break;

    case "invite":
      let channelToInviteUserTo;
      channelToInviteUserTo = message.mentions.channels.first();
      if (!channelToInviteUserTo) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            "  you need to specify a channel!"
        );
      }
      let channelIn = channelsCreated.find(
        channel => channel.newChannel === channelToInviteUserTo.id
      );
      console.log(channelIn);
      if (!channelIn) {
        return message.channel.send(
          "`" +
            message.author.username +
            "`" +
            ", you cannot invite someone to this channel "
        );
      }
      message.channel
        .send(
          "You have been invited to an instanced channel!" +
            "`" +
            message.author.tag +
            "`\n`React` to this message to join!"
        )
        .then(msg => {
          msg.react("✔️");
          channelIn.id.push(msg.id);
          console.log("channelsCreated = ", channelsCreated);
        });
      break;
    case "getBeans":
      devBeans.getBeans(message, args);
      break;
    case "endSeason":
      devBeans.endSeason(message, args);
      break;
    case "lb":
    case "leaderboard":
      devBeans.leaderboardManager(bot, message, args);
      break;
    case "leave":
      leaveInstanced(message);
      break;

    /*case "buy":
          currency.buy(message, args);
      break;
      case "balance":
      currency.balance(message, args);
      break;
    case "daily":
      currency.daily(message, args);
      break;*/
    default:
      break;
  }
});

bot.login(process.env.DISCORD_TOKEN);

function leaveInstanced(message) {
  const messageRole = channelsCreated.find(
    channel => channel.newChannel === message.channel.id
  );
  if (!messageRole) {
    return message.channel.send("You cannot leave this channel");
  }
  const isRoleActive = message.guild.roles.cache.find(
    role => role.id === messageRole.role
  );
  if (!isRoleActive) {
    return message.channel.send("Umm...");
  }
  if (
    !message.guild.members.cache
      .get(message.author.id)
      .roles.cache.some(role => role.id === messageRole.role)
  )
    return;
  let channel = bot.channels.cache.get(messageRole.newChannel);
  console.log(channel);
  message.guild.members.cache
    .get(message.author.id)
    .roles.remove(messageRole.role)
    .then(
      channel.send(
        "`" + `${message.author.username}` + "`" + " left the channel!"
      )
    );
}
function instancedChannelAddRole(messageReaction, user) {
  if (user.bot) return;
  if (channelsCreated.length === 0) return;
  const messageRole = channelsCreated.find(channel =>
    channel.id.includes(messageReaction.message.id)
  );
  console.log(messageReaction.message.id);
  const isUserBlacklisted = messageRole.blacklist.find(
    blacklisted => blacklisted === user.id
  );
  if (isUserBlacklisted) {
    return messageReaction.message.channel
      .send(
        "`" + user.username + "`" + " you are blacklisted from this channel"
      )
      .then(m => m.delete({ timeout: 10000 }));
  }

  const isRoleActive = messageReaction.message.guild.roles.cache.find(
    role => role.id === messageRole.role
  );
  if (!isRoleActive) {
    return messageReaction.message.channel
      .send("`" + user.username + "`" + " that channel does not exist anymore")
      .then(m => m.delete({ timeout: 10000 }));
  }
  if (
    messageReaction.message.guild.members.cache
      .get(user.id)
      .roles.cache.some(role => role.id === messageRole.role)
  )
    return;

  let channel = bot.channels.cache.get(messageRole.newChannel);
  messageReaction.message.guild.members.cache
    .get(user.id)
    .roles.add(messageRole.role)
    .then(
      channel.send("`" + `${user.username}` + "`" + " joined the channel!")
    );
}
function checkActivity() {
  let index;
  channelsCreated.forEach(channel => {
    console.log(channel);
    let channelChecking = bot.channels.cache.get(channel.newChannel);
    let roleToEliminate;
    bot.guilds.cache.forEach(guild => {
      if (guild.roles.cache.find(role => role.id === channel.role)) {
        roleToEliminate = guild.roles.cache.find(
          role => role.id === channel.role
        );
      }
    });
    if (!channelChecking)
      return channelsCreated.splice(channelsCreated.indexOf(channel), 1);
    let time = Date.now() - channelChecking.lastMessage.createdAt;
    console.log(time / 60000);
    if (time >= 4.32e7) {
      channel.channelEmbed.messages
        .fetch(channel.id)
        .then(msg =>
          msg.edit(
            "An instanced channel was created, but it has been " + "`deleted`"
          )
        )
        .catch(err => console.err);
      channelChecking
        .delete()
        .then((index = channelsCreated.indexOf(channel)))
        .then(roleToEliminate.delete())
        .then(
          channel.channelForModeration.send(
            "The instanced channel has been" + " `deleted`"
          )
        )
        .then(channelsCreated.splice(index, 1))
        .catch(err => console.err);
    }
  });
}
function createInstancedP1(message, args) {
  const channelName = args[1];
  const roleExists = message.guild.roles.cache.find(
    role => role.name === channelName
  );
  const channelExists = message.guild.channels.cache.find(
    channel => channel.name === channelName
  );

  if (channelExists || roleExists) {
    return message.channel.send(
      "I could not create an instanced channel. Reason: `There is a channel or role with the same name`"
    );
  }
  message.guild.roles
    .create({ data: { name: channelName } })
    .then(role => createInstancedChannel(message, args, role))
    .catch(err => console.err);
}
function createInstancedChannel(message, args, role) {
  const channelName = args[1];
  if (!channelName) {
    return message.channel.send(
      "I could not create an instanced channel. Reason: `No Name Provided`"
    );
  }
  message.guild.channels.create(channelName).then(channel => {
    channel.updateOverwrite(channel.guild.roles.everyone, {
      VIEW_CHANNEL: false
    });
    channel.updateOverwrite(role.id, {
      VIEW_CHANNEL: true
    });
    channel
      .setParent(instancedChannelParent)
      .then(channel =>
        channel.send(
          "`" + message.author.username + "`" + " has created this channel"
        )
      );

    bot.guilds.cache
      .find(guild => guild.id === "736715831962107924")
      .channels.create(channelName)
      .then(channelForMod => {
        channelForMod.send(
          "`Created by:` " +
            `<@${message.author.id}>` +
            "\n`Role ID:` " +
            role.id +
            "\n`Channel ID:` " +
            channel.id
        );
        createInstancedEmbed(message, args, channel, role, channelForMod);
      })
      .catch(err => console.err);
  });
}
function createInstancedEmbed(message, args, channel, role, channelForMod) {
  message.channel
    .send(
      "A instanced channel has been created by " +
        "`" +
        message.author.tag +
        "`\n`React` to this message to join the instanced channel."
    )
    .then(msg => callBack(message, msg, role, channel, channelForMod));
}
function callBack(message, msg, role, channel, channelForMod) {
  channelsCreated.push(
    (channel = {
      id: [msg.id],
      role: role.id,
      newChannel: channel.id,
      blacklist: [],
      creator: message.author.id,
      channelEmbed: message.channel,
      channelForModeration: channelForMod
    })
  );
  msg.react("✔️");
}
/**
 * @function updateCounters
 * @description Updates the server stats.
 * @param {Discord.GuildMember} member Member who joined or left the guild.
 * @param {Discord.Message} message The message sent to call this command.
 **/
function checkIfInstancedChannel(message) {
  if (message.author.bot) return;
  if (!message.channel.parentID === instancedChannelParent) return;
  let instancedChannel = channelsCreated.find(
    channel => channel.newChannel === message.channel.id
  );
  if (!instancedChannel) return;
  if (!instancedChannel.channelForModeration) return;
  if (!message.author.id === "695772618275553343") {
    try {
      instancedChannel.channelForModeration.send(
        "`" +
          "Author:" +
          "` " +
          `<@${message.author.id}>` +
          "\n`" +
          "Message Content:" +
          "`" +
          ` ${message.content}` +
          "\n------------------------------------------"
      );
    } catch (error) {
      console.log("channel mod deleted");
    }
  } else {
    try {
      instancedChannel.channelForModeration.send(
        "`" +
          "Author:" +
          "` " +
          "DevLaunchers" +
          "\n`" +
          "Message Content:" +
          "`" +
          ` ${message.content}` +
          "\n------------------------------------------"
      );
    } catch (error) {
      console.log("channel mod deleted");
    }
  }
}
function updateCounters(member, message) {
  const server = message || member;
  bot.channels.cache
    .get(countChannel.total)
    .setName(`Total Members: ${server.guild.memberCount}`)
    .catch(err => console.err());
  if (!member) {
    message.channel.send("I successfully updated the counters!");
  }
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
  let icon = bot.user.displayAvatarURL({ size: 2048 });
  let avatar = member.user.displayAvatarURL({ size: 2048 });
  // If a channel with the name "welcome", we just want to return.
  if (!welcomeChannel) return;
  const welcomeEmbed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.tag}`, avatar, avatar)
    .setDescription(`Welcome **${member.user.username}**, thanks for joining!`)
    .setFooter(`DevLaunchers`, icon, icon)
    .setColor(0xff9f01);
  welcomeChannel.send(welcomeEmbed);
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
  message.delete();
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
function checkIfInviteCode(message) {
  if (message.author.bot) return;
  let inviteLink = ["discord.gg", "discord.com/invite", "discord.com/invite"];
  if (!message.member.permissions.has("ADMINISTRATOR"))
    if (inviteLink.some(word => message.content.includes(word))) {
      if (message.channel.id === showcaseChannelID) return;
      message.delete();
      return message
        .reply(
          `\n You can only post invites on <#${showcaseChannelID}>. \n Make sure they are invites to art, coding, music, based servers.`
        )
        .then(m => m.delete({ timeout: 10000 }))
        .catch(console.err);
    }
}
function sendTeamsRulesMessage(message) {
  if (message.author.permissions.has("MANAGE_MESSAGES")) return;
  message.delete();
  message.channel.send(
    "**teams-and-projects guidelines:** \n *We'll pin your message if:* \n  - The message has enough detail to be helpful to people who may want to help out with the project, or invite you to theirs \n - The message isn't excessively long (like taking up an entire screen) \n    - The message isn't a verbatim copy of a recent already pinned message \n *We'll remove your message if:* \n - The message takes up too much space \n - The message is spammy or an advertisement \n -You leave the server after posting your message"
  );
}
function sendRoleInfoEmbed(message, args) {
  if ([!args[1]]) {
    const roleNames = [];
    message.guild.roles.cache.forEach(role => {
      roleNames.push(role.name);
    });
    const roleInfoEmbed = new Discord.MessageEmbed().addField(
      "Roles",
      roleNames
    );
    message.channel.send(roleInfoEmbed);
  }
}

function registerMetrics() {
  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  const Registry = promClient.Registry;
  const register = new Registry();
  collectDefaultMetrics({ register });
  const events = new promClient.Counter({
    name: "events_count",
    help: "Count of discrod events",
    labelNames: ["event"]
  });
  register.registerMetric(events);
  return {
    register: register,
    events: events
  };
}

function startMetricsServer(metrics) {
  const server = express();
  server.get("/metrics", (req, res) => {
    res.set("Content-Type", metrics.register.contentType);
    res.end(metrics.register.metrics());
  });

  const port = process.env.PORT;
  console.log(
    `Metrics server listening to ${port}, metrics exposed on /metrics endpoint`
  );
  server.listen(port);
}
