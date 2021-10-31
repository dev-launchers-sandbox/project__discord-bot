const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("Message", (Message) => {
  class MessageExtension extends Message {
    constructor(client, data, channel) {
      super(client, data, channel);
    }
  }

  return MessageExtension;
});
