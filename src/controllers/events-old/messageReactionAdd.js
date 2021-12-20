const Discord = require("discord.js");

const ms = require("parse-ms");
const metrics = require("../../index.js");

const BeanMessenger = require("../../plugins/Bean/structures/BeanManager.js");
let beanMessenger = new BeanMessenger();

async function fetchMessage(client, messageReaction, user) {
  if (messageReaction.message.partial) {
    return await messageReaction.fetch();
  } else return messageReaction;
}

async function removeEmoji(messageReaction, user) {
  try {
    await db.push(`ignore_reactions`, {
      message: messageReaction.message.id,
      user: user.id,
      emoji: messageReaction.emoji.id,
    });
  } catch (error) {
    console.log(error);
  }
  const userReactions = messageReaction.message.reactions.cache.filter((reaction) =>
    reaction.users.cache.has(user.id)
  );
  try {
    for (const reaction of userReactions.values()) {
      await reaction.users.remove(user.id);
    }
  } catch (error) {
    console("Failed to remove reactions.");
  }
}

module.exports = async (client, messageReaction, user) => {
  metrics.sendEvent("message_reaction_add");
  if (messageReaction.emoji.name === "🎟️") {
    let message = await fetchMessage(client, messageReaction, user);
    return openTicket(client, message, user);
  }
  if (messageReaction.emoji.name === "villager") {
    let message = await fetchMessage(client, messageReaction, user);
    return giveMinecraftRole(client, message, user, messageReaction);
  }
};

async function openTicket(client, messageReaction, user) {
  if (user.bot) return;
  const ticketMessage = await db.get(`ticket.${messageReaction.message.guild.id}`);

  if (messageReaction.message.id !== ticketMessage) return;

  const message = messageReaction.message;

  const ticketCategory = db.get(`ticket-category.${message.guild.id}`);
  if (!ticketCategory || !categoryExists(ticketCategory, message.guild)) return;

  if (numOfTicketsOpen(message, ticketCategory) >= 10) {
    user.send("There are too many tickets open! If it is an emergency, please dm an admin/mod");
    return removeReaction(client, message, user);
  }

  let modRole = db.get(`moderator.${message.guild.id}`);
  if (!modRole) modRole = "blank"; //Avoid empty message error in line 222
  let adminRole = db.get(`admin.${message.guild.id}`);
  if (!adminRole) adminRole = "blank"; //Avoid empty message error in line 222

  const newTicket = await message.guild.channels.create(`ticket-${user.username}`);

  await newTicket.updateOverwrite(message.channel.guild.roles.everyone, {
    VIEW_CHANNEL: false,
  });

  await newTicket.updateOverwrite(user.id, {
    VIEW_CHANNEL: true,
  });

  await newTicket.updateOverwrite(modRole, {
    VIEW_CHANNEL: true,
  });

  newTicket.setParent(ticketCategory);

  removeReaction(client, message, user);

  newTicket.send(`<@${user.id}>`).then((msg) => msg.delete());
  newTicket.send(`<@&${modRole}>`).then((msg) => msg.delete());
  newTicket.send(`<@&${adminRole}>`).then((msg) => msg.delete());
}

async function removeReaction(client, message, user) {
  message.reactions.removeAll();
  message.react("🎟️");
}
function categoryExists(ticketCategory, guild) {
  let categoryExists;
  const guildChannels = guild.channels.cache;

  guildChannels.forEach((channel) => {
    if (channel.type === "category" && channel.id === ticketCategory) {
      categoryExists = true;
    }
  });

  return categoryExists;
}

function numOfTicketsOpen(message, ticketCategoryId) {
  const category = message.guild.channels.resolve(ticketCategoryId);
  return category.children.size;
}

function giveMinecraftRole(client, message, user, messageReaction) {
  const minecraftMsg = db.get(`minecraft.${messageReaction.message.guild.id}`);
  const role = db.get(`minecraft-role.${messageReaction.message.guild.id}`);
  const userReacted = messageReaction.message.guild.members.resolve(user.id);
  if (messageReaction.message.id === minecraftMsg) {
    if (!userReacted.roles.cache.has(role)) {
      userReacted.roles.add(role);
      const channel = messageReaction.message.guild.channels.resolve(
        db.get(`minecraft-channel.${messageReaction.message.guild.id}`)
      );

      channel.send(
        `Welcome <@${user.id}> to the Minecraft Area of Dev Launchers!\nIf you plan on joining the server, the IP is: **minecraft.devlaunchers.com:31672**`
      );
    }
  }
}
