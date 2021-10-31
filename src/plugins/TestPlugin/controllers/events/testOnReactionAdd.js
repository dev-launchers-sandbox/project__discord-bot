// Name of the discord.js event
exports.eventHandle = "messageReactionAdd";

// Code to be executed
exports.event = async (client, messageReaction, reactor) => {
  messageReaction.message.channel.send(messageReaction._emoji.name);
};
