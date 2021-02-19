const db = require("quick.db");
let channelsDeletedIDs = [];

module.exports = async(client) => {
    console.log(`${client.user.username} is online!`);
    client.user.setActivity("DevLaunchers", { type: "WATCHING" });
    setInterval(checkActivity, 60 * 1000, client);
};

async function checkActivity(client) {
    const clientGuilds = client.guilds.cache;

    clientGuilds.forEach(async(guild) => {
        let instancedChannels = await db.get(`instanced.${guild.id}`);
        if (!instancedChannels || instancedChannels.length === 0) return;

        await instancedChannels.forEach(async(channel) => {
            let channelChecking = client.channels.resolve(channel.newChannel);
            let lastMessageTime;

            if (!channelChecking) return channelsDeletedIDs.push(channel.newChannel);

            // fetch the entire lastMessage from a channel to be able to access the createdAt
            if (!channelChecking.lastMessage) {
                lastMessageTime = await channelChecking.messages.fetch(channelChecking.lastMessageID).createdAt;
            } else lastMessageTime = channelChecking.lastMessage.createdAt;

            if (!lastMessageTime) return;

            let time = Date.now() - lastMessageTime;
            if (time < 1000 * 60 * 60 * 24 * 2) return; // two days

            if (guild.roles.resolve(channel.role)) {
                const roleToDelete = guild.roles.resolve(channel.role);
                await deleteRole(roleToDelete);
            }

            // delete the channel once we remove the roles attached to it.
            await deleteChannel(channelChecking);
            await sendModerationMessage(client, channel);
            await deleteDirectoryEntry(channel, guild);
            await channelsDeletedIDs.push(channel.newChannel);
        });

        const updatedChannels = instancedChannels.filter((channel) => { return !channelsDeletedIDs.includes(channel.newChannel) });
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

    const message = await directoryChannel.messages.fetch(channelObj.directoryEntry);
    if (!message) return;
    if (message.deleted) return;

    message.delete();
}