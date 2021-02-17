const { getMessageTarget } = require("../../../../utils/getMessageTarget");

exports.help = {
    name: "profile",
    description: "Shows the profile of a user.",
    usage: `profile [user]`,
    example: `profile @Hextanium#5890`,
};

exports.conf = {
    aliases: ["p", "prof"],
    cooldown: 10,
};

exports.run = async(client, message, args) => {
    let target = getMessageTarget(message, args);
    if (!target) target = message.guild.members.resolve(message.author.id);
    if (target.user.bot) {
        return message.channel.send("Bot's don't have profiles.");
    } else if (target.user) {
        const LevelManager = require('../../structures/LevelManager');
        let levelingManager = new LevelManager(message.guild);
        levelingManager.sendProfileOf(target, message);
    } else {
        return message.channel.send("That does not appear to be a user.");
    }
};