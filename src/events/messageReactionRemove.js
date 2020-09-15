const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const metrics = require("../index.js");

async function fetchMessage(client, messageReaction, user) {
  if (messageReaction.message.partial) {
    return await messageReaction.fetch();
  } else return messageReaction;
}

module.exports = async (client, messageReaction, user) => {
  metrics.sendEvent("remove");
  if (user.bot) return;

  if (messageReaction.emoji.name === "DevBean") {
    let message = await fetchMessage(client, messageReaction, user);
    const doIgnore = await isReactionIgnored(client, messageReaction, user);
    if (!doIgnore) return removeDevBean(client, message, user);
  }
  if (messageReaction.emoji.name === "GoldenBean") {
    let message = await fetchMessage(client, messageReaction, user);
    const doIgnore = await isReactionIgnored(client, messageReaction, user);
    if (!doIgnore) return removeGoldenBean(client, message, user);
  }
  if (messageReaction.emoji.name === "✔️") {
    let message = await fetchMessage(client, messageReaction, user);
    return leaveChannel(client, message, user);
  }
};

async function removeDevBean(client, messageReaction, user) {
  //if the user did not unreact with the correct emoji, we do not want to do anything
  let userToRemoveBeansTo = messageReaction.message.author; //id of the users whos message got a reaction
  let userWhoReacted = user.id; //user that reacted

  //if there were any bots involved in the message we do not want to continue
  if (user.bot || userToRemoveBeansTo.bot) return;
  //if the user reaction to his own message he will not get a devBean
  if (userToRemoveBeansTo.id === userWhoReacted) return;
  try {
    db.subtract(`account.${userToRemoveBeansTo.id}.devBeans`, 1); //subtract the amount of beans
    db.delete(`account.${user.id}.lastDevBean`);

    user.send(
      `Dev-Bean removed from **${messageReaction.message.author.tag}**`
    );
  } catch (err) {
    //if there is an error, send an "error" message
    user.send(
      "Oopsie, for some reason I could not remove a dev-bean from the user"
    );
  }
}

async function removeGoldenBean(client, messageReaction, user) {
  let lastGoldenBeanAwarded = db.get(`lastGoldenBeanAwarded.${user.id}`);

  let target = messageReaction.message.author.id; //id of the users whos message got an "unreaction"
  let reactor = user.id; //user that "unreacted"
  //if there were any bots involved in the message we do not want to continue
  if (user.bot || messageReaction.message.author.bot) return;
  //if the user unreacted to his own message he will not get a devBean
  if (target === reactor) return;
  if (lastGoldenBeanAwarded !== messageReaction.message.id) {
    return user.send(
      `**${user.username}**, you can only remove the last golden-bean you awarded!`
    );
  }
  try {
    db.subtract(`account.${target}.goldenBeans`, 1); //remove the amount of golden-beans
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
}

function leaveChannel(client, messageReaction, user) {
  let channelsCreated = db.get(`instanced.${messageReaction.message.guild.id}`);
  if (!Array.isArray(channelsCreated)) return;

  if (channelsCreated.length === 0) return;

  const messageRole = channelsCreated.find((channel) =>
    channel.id.includes(messageReaction.message.id)
  );
  if (!messageRole) return;

  const isRoleActive = messageReaction.message.guild.roles.cache.find(
    (role) => role.id === messageRole.role
  );
  if (!isRoleActive) {
    return messageReaction.message.channel.send(
      "`" + user.username + "`" + " that channel does not exist anymore"
    );
  }

  if (
    !messageReaction.message.guild.members.cache
      .get(user.id)
      .roles.cache.some((role) => role.id === messageRole.role)
  )
    return;

  let channel = client.channels.cache.get(messageRole.newChannel);

  messageReaction.message.guild.members.cache
    .get(user.id)
    .roles.remove(messageRole.role)
    .then(channel.send("`" + `${user.username}` + "`" + " left the channel!"));
}

async function isReactionIgnored(client, messageReaction, user) {
  let ignoreReactions = await db.get(`ignore_reactions`);
  let reaction;
  if (!ignoreReactions) return false;
  ignoreReactions.forEach((r) => {
    if (
      r.message === messageReaction.message.id &&
      r.user === user.id &&
      r.emoji === messageReaction.emoji.id
    ) {
      reaction = r;
    }
  });
  if (!reaction) return false;

  let index = ignoreReactions.indexOf(reaction);
  ignoreReactions.splice(index, 1);
  await db.set(`ignore_reactions`, ignoreReactions);
  return true;
}
