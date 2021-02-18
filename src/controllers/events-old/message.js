const Discord = require("discord.js");
const db = require("quick.db");
const metrics = require("../../index.js");
const commandUsage = require("../../utils/commandUsage.js");
const CommandHandler = require("./../../extensions/.common/structures/CommandHandler/CommandHandler.js");
const LevelManager = require("./../../extensions/Leveling/structures/LevelManager.js");
const cooldowns = new Discord.Collection();
const levelManager = new LevelManager();

const DISCORD_INVITE_REGEX = /discord(?:\.com|app\.com|\.gg)[\/invite\/]?(?:[a-zA-Z0-9\-]{2,32})/g;

module.exports = async(client, message) => {
    const prefix = db.get(`prefix.${message.guild ? message.guild.id : "make-this-not-work"}`) || ".";
    const args = message.content.slice(prefix.length).trim().split(" ");

    if (!message.guild) return;

    if (message.author.id === "302050872383242240") bumpCheck(message); // Disboard's ID
    if (message.author.id === "159985870458322944") newLevelCheck(message, args); // MEE6's ID

    if (DISCORD_INVITE_REGEX.test(message.content)) {
        let teamsChannel = db.get(`teams.${message.guild.id}`) || "None";
        if (message.channel.id === teamsChannel) return;
        if (message.member.hasPermission("ADMINISTRATOR")) return;
        message.delete()
            .then(message.channel.send(`**${message.author.username}** you cannot promote your server here! You can only promote it in <#713093099609653298> *if it is related to a project.*`))
            .then((msg) => commandUsage.deleteMsg(msg));
    }

    moderateInstancedChannels(client, message);

    if (message.content === `<@!${client.user.id}>`) {
        return message.channel.send(`My prefix for this server is **${prefix}**`);
    }
    if (message.author.bot || message.author === client.user) return;
    levelManager.queue(message);
    if (!message.content.startsWith(prefix)) return;

    let cmd = args.shift().toLowerCase();

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }
    let commandFile =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return console.log("command not found");

    if (!cooldowns.has(commandFile.help.name))
        cooldowns.set(commandFile.help.name, new Discord.Collection());

    const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

    if (!commandFile) return;
    let commandHandler = new CommandHandler(
        commandFile.help.name,
        message,
        args
    );

    if (!commandHandler.validateCommand({
            permissions: commandFile.conf.permissions || [],
            arguments: commandFile.conf.arguments || [],
        }))
        return;

    if (!timestamps.has(member.id)) {
        if (!client.config.contributors.includes(message.author.id)) {
            timestamps.set(member.id, now);
        }
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            try {
                message.delete();
            } catch {
                console.log("ERROR IN DELETING MESSAGE --> message.js");
            }
            return message.channel.send(`You need to wait **${timeLeft.toFixed(1)}** seconds to use this command again!`)
                .then((msg) => commandUsage.deleteMsg(msg));
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    }

    try {
        metrics.sendEvent("message_" + commandFile.help.name);
        commandFile.run(client, message, args);
    } catch (error) {
        console.log(error);
    }
};

function moderateInstancedChannels(client, message) {
    let instancedChannels = db.get(`instanced.${message.guild.id}`);
    let instancedChannel;
    if (Array.isArray(instancedChannels)) {
        instancedChannel = instancedChannels.find(
            (channel) => channel.newChannel === message.channel.id
        );
    }
    if (!instancedChannel) return;

    let moderationChannel = client.channels.resolve(
        instancedChannel.channelForModeration.id
    );

    if (!moderationChannel) return;
    let messageData =
        "`" +
        "Author:" +
        "` " +
        `<@${message.author.id}>` +
        "\n`" +
        "Message Content:" +
        "`" +
        ` ${message.content}` +
        "\n------------------------------------------";

    moderationChannel.send(messageData);
}

function bumpCheck(message) {
    const embed = message.embeds[0];
    if (!embed) return;
    if (!embed.image) return;
    if (embed.image.url === "https://disboard.org/images/bot-command-image-bump.png") {
        const description = embed.description;
        const openingSign = description.indexOf("<");
        const closingSign = description.indexOf(">");
        const userId = description.substring(openingSign + 2, closingSign);

        const beans = getRandomBeans();

        const emote = getEmote(message.guild, beans.type);

        message.channel.sendEmbed({
            color: 0xff9f01,
            author: "You are the best!",
            description: `Thank you for bumping the server! Please take ${beans.value} ${emote}`
        });

        db.add(`account.${userId}.${beans.type}`, beans.value);
        if (beans.type === "devBeans") {
            db.add(`account.${userId}.foreverDevBeans`, beans.value);
        } else db.add(`account.${userId}.foreverGoldenBeans`, beans.value);
    }
}

function getRandomBeans() {
    const num = Math.random();

    if (num <= 0.9) return { type: "devBeans", value: 1 };
    else if (num <= 0.95) return { type: "devBeans", value: 2 };
    else if (num <= 0.98) return { type: "devBeans", value: 3 };
    else return { type: "goldenBeans", value: 1 };
}

function getEmote(guild, type) {
    type = type.substring(0, type.length - 1);
    type = type[0].toUpperCase() + type.slice(1);
    const emote = guild.emojis.cache.find((emoji) => emoji.name === type);

    return emote || type;
}

async function newLevelCheck(message, args) {
    if (!args.includes("advanced")) return;

    const user = message.mentions.members.first();
    const lvl = args[4];
    const levels = ["1", "5", "10", "15", "20", "25", "30", "35", "40"];
    if (!levels.includes(lvl)) return;

    const index = levels.indexOf(lvl);
    user.roles.add(getRoleLevel(message, lvl));

    for (let i = index - 1; i !== -1; i--) {
        const role = getRoleLevel(message, levels[i]);
        if (user.roles.cache.has(role.id)) {
            user.roles.remove(role.id);
        }
    }
}

function getRoleLevel(message, lvl) {
    let wordNum;
    switch (lvl) {
        case "1":
            wordNum = "one";
            break;
        case "5":
            wordNum = "five";
            break;
        case "10":
            wordNum = "ten";
            break;
        case "15":
            wordNum = "fifteen";
            break;
        case "20":
            wordNum = "twenty";
            break;
        case "25":
            wordNum = "twenty-five";
            break;
        case "30":
            wordNum = "thirty";
            break;
        case "35":
            wordNum = "thirty-five";
            break;
        default:
            wordNum = "forty";
    }

    const role = message.guild.roles.resolve(
        db.get(`levels.${message.guild.id}.${wordNum}`)
    );

    return role;
}