const Discord = require("discord.js");
const db = require("quick.db");
let channelsDeletedIDs = [];
const directMessage = require("../../utils/instancedManager.js");

module.exports = async (client) => {
  console.log("The bot is online");
  client.user.setActivity("DevLaunchers", { type: "WATCHING" });
  setInterval(checkActivity, 60000, client);
};

//setInterval(checkActivity, 60000, client);
//4.32e7

async function checkActivity(client) {
  const clientGuilds = client.guilds.cache;

  // loop through the guilds
  clientGuilds.forEach(async (guild) => {
    // grab the instance channels for this server
    let instancedChannels = await db.get(`instanced.${guild.id}`);
    // if there are no instance channels for this server just return;
    if (!instancedChannels || instancedChannels.length === 0) return;

    // loop through the instanced channels so we can
    // see if any have expired.
    await instancedChannels.forEach(async (channel) => {
      // get the channel object
      let channelChecking = client.channels.resolve(channel.newChannel);
      // if the channel has been manually deleted remove from database
      if (!channelChecking) return channelsDeletedIDs.push(channel.newChannel);

      let lastMessageTime;

      //fetch the entire lastMessage from a channel to be able to access the createdAt
      if (!channelChecking.lastMessage) {
        lastMessageTime = await channelChecking.messages.fetch(
          channelChecking.lastMessageID
        ).createdAt;
      } else lastMessageTime = channelChecking.lastMessage.createdAt;

      if (!lastMessageTime) return;
      // check if this channel has expired
      let time = Date.now() - lastMessageTime;

      // more readable code if we just return here.
      // if the channel hasn't expired
      if (time < 8.64e7) return;

      // see if we can find this role (could use one find for ...
      // ... the check and the delete instead of doing the same one twice)
      if (guild.roles.resolve(channel.role)) {
        // find the role linked to this channel

        const roleToDelete = guild.roles.resolve(channel.role);
        // delete the role
        await deleteRole(roleToDelete);
      }

      // delete the channel once we remove the roles attached to it.
      await deleteChannel(channelChecking);
      await sendModerationMessage(client, channel);
      await deleteDirectoryEntry(channel, guild);

      await channelsDeletedIDs.push(channel.newChannel);
    });
    const updatedChannels = instancedChannels.filter(
      (channel) => !channelsDeletedIDs.includes(channel.newChannel)
    );

    await db.set(`instanced.${guild.id}`, updatedChannels);
  });
}

async function deleteChannel(channel) {
  await channel.delete();
}

async function sendModerationMessage(client, channel) {
  let modChannel = client.channels.resolve(channel.channelForModeration.id);
  if (!modChannel) return;
  modChannel.send("This channel has been deleted");
}

async function deleteRole(role) {
  await role.delete();
}

async function deleteDirectoryEntry(channelObj, guild) {
  const directoryChannelId = db.get(`directory.${guild.id}`);
  if (!directoryChannelId) return;
  const directoryChannel = guild.channels.resolve(directoryChannelId);
  if (!directoryChannel) return;

  if (!channelObj.directoryEntry) return;
  const message = await directoryChannel.messages.fetch(
    channelObj.directoryEntry
  );
  if (!message) return;
  if (message.deleted) return;

  message.delete();
}
