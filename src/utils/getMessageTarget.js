// Author: the message sender who has triggered this command
// Target: a Discord user this command is targetting
function getTargetByMention(message) {
    let userID = message.mentions.users.first().id;
    return message.guild.members.cache.get(userID);
}

function getTargetById(message, args) {
    let target = message.guild.members.resolve(args[0]);
    return target;
}

// Returns a User, or an Error if messages were not formatted correctly or the user is not found
module.exports = {
    getMessageTarget: function(message, args) {
        let target;
        if (message.mentions.users.first()) {
            target = getTargetByMention(message);
        } else if (args[0]) {
            target = getTargetById(message, args);
        }
        return target;
    },
};