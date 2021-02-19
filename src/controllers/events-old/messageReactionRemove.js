const metrics = require("../../index.js");
const db = require("quick.db");

async function fetchMessage(messageReaction) {
    if (messageReaction.message.partial) {
        return await messageReaction.fetch();
    } else return messageReaction;
}

module.exports = async(client, messageReaction, user) => {
    metrics.sendEvent("remove");
    if (user.bot) return;

    if (messageReaction.emoji.name === "DevBean") {
        let message = await fetchMessage(messageReaction);
        const doIgnore = await (messageReaction, user);
        if (!doIgnore) return removeDevBean(message, user);
    }
    if (messageReaction.emoji.name === "GoldenBean") {
        let message = await fetchMessage(messageReaction);
        const doIgnore = await isReactionIgnored(messageReaction, user);
        if (!doIgnore) return removeGoldenBean(message, user);
    }
    if (messageReaction.emoji.name === "✔️") {
        let message = await fetchMessage(messageReaction);
        return leaveChannel(client, message, user);
    }
    if (messageReaction.emoji.name === "villager") {
        return removeMinecraftRole(user, messageReaction);
    }
};

function removeDevBean(messageReaction, user) {
    let userToRemoveBeansTo = messageReaction.message.author;

    if (user.bot || userToRemoveBeansTo.bot || userToRemoveBeansTo.id === user.id) return;

    try {
        db.subtract(`account.${userToRemoveBeansTo.id}.devBeans`, 1);
        db.subtract(`account.${userToRemoveBeansTo.id}.foreverDevBeans`, 1);
        db.delete(`account.${user.id}.lastDevBean`);

        user.send(`DevBean removed from **${messageReaction.message.author.tag}**`);
    } catch (e) {
        // If there is an error, send an "error" message
        user.send("Due to an unknown error, I was not able to remove a DevBean from that user. Please report this bug.");
    }
}

function removeGoldenBean(messageReaction, user) {
    let lastGoldenBeanAwarded = db.get(`lastGoldenBeanAwarded.${user.id}`);
    let target = messageReaction.message.author.id; //id of the users whos message got an "unreaction"

    if (user.bot || messageReaction.message.author.bot || target === user.id) return;

    if (lastGoldenBeanAwarded !== messageReaction.message.id) {
        return user.send(
            `**${user.username}**, you can only remove the last golden-bean you awarded!`
        );
    }

    try {
        db.subtract(`account.${target}.goldenBeans`, 1); //remove the amount of golden-beans
        db.subtract(`account.${target}.foreverGoldenBeans`, 1);
        db.delete(`lastGoldenBean.${user.id}`);
        user.send(`Golden-Bean removed from **${messageReaction.message.author.tag}**`);
    } catch (err) {
        // If there is an error, send an "error" message
        user.send("Due to an unknown error, I was not able to remove a GoldenBean from that user. Please report this bug.");
    }
}

function leaveChannel(client, messageReaction, user) {
    let channelsCreated = db.get(`instanced.${messageReaction.message.guild.id}`);
    if (!Array.isArray(channelsCreated)) return;

    if (channelsCreated.length === 0) return;

    const messageRole = channelsCreated.find((channel) => { return channel.id.includes(messageReaction.message.id) });
    if (!messageRole) return;

    const isRoleActive = messageReaction.message.guild.roles.cache.find((role) => { return role.id === messageRole.role });
    if (!isRoleActive) return messageReaction.message.channel.send("`" + user.username + "`" + " that channel does not exist anymore");

    if (!messageReaction.message.guild.members.cache.get(user.id).roles.cache.some((role) => { return role.id === messageRole.role })) return;

    let channel = client.channels.cache.get(messageRole.newChannel);

    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageRole.role).then(channel.send("`" + `${user.username}` + "`" + " left the channel!"));
}

async function isReactionIgnored(messageReaction, user) {
    let ignoreReactions = await db.get(`ignore_reactions`);
    if (!ignoreReactions) return false;
    let reaction;

    ignoreReactions.forEach(r => {
        if (r.message === messageReaction.message.id && r.user === user.id && r.emoji === messageReaction.emoji.id) {
            reaction = r;
        }
    });

    if (!reaction) return false;

    let index = ignoreReactions.indexOf(reaction);

    ignoreReactions.splice(index, 1);

    await db.set(`ignore_reactions`, ignoreReactions);

    return true;
}

function removeMinecraftRole(user, messageReaction) {
    const minecraftMsg = db.get(`minecraft.${messageReaction.message.guild.id}`);
    const role = db.get(`minecraft-role.${messageReaction.message.guild.id}`);

    if (messageReaction.message.id === minecraftMsg) messageReaction.message.guild.members.resolve(user.id).roles.remove(role);
}