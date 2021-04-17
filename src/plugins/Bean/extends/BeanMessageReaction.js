const BeanManager = require("./../structures/BeanManager.js");
const { Structures } = require("discord.js");
const dbh = require("./../../.common/structures/DataHandling/DatabaseHandler.js");
const ms = require("parse-ms");

Structures.extend("MessageReaction", (MessageReaction) => {
  class BeanMessageReaction extends MessageReaction {
    constructor(client, data, message) {
      super(client, data, message);
      this.beanManager = new BeanManager(dbh, client);
    }

    isDevBeanReaction() {
      let devBeanEmoji = this.beanManager.getDevBeanEmoji();
      if (!devBeanEmoji) return false;
      if (this._emoji.id === devBeanEmoji.id) return true;
      return false;
    }

    isGoldenBeanReaction() {
      let goldenBeanEmoji = this.beanManager.getGoldenBeanEmoji();
      if (!goldenBeanEmoji) return false;
      if (this._emoji.id === goldenBeanEmoji.id) return true;
      return false;
    }
  }

  return BeanMessageReaction;
});
