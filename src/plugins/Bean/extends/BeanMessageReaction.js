const Discord = require("discord.js");
const { Structures } = require("discord.js");

const BEAN_EMOJIS = ["DevBean", "DevBean-1"];

Structures.extend("MessageReaction", (MessageReaction) => {
  class BeanMessageReaction extends MessageReaction {
    constructor(client, data, message) {
      super(client, data, message);
    }

    isBeanReaction() {
      if (BEAN_EMOJIS.includes(this.emoji.name)) return true;
      return false;
    }

    async handleBeanReaction(message, user) {
      console.log("handling bean reaction");
      let sender = this.emoji.client.user.username;
      let receiver = this.message.author.username;

      this.message.channel.sendEmbed({
        title: "DevBean Reaction Detected",
        description: sender + " has given a DevBean to " + receiver,
      });
    }

    addBeanToUser() {}

    removeBeanFromUser() {}
  }

  return BeanMessageReaction;
});
