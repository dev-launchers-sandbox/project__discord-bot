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
      /*
        A reaction is considered a Dev Bean Reaction when the emoji name matches the name of the
        "Parent Reaction" (the Dev Bean reaction in the main Dev Launchers server), and when the emoji is from the
        same server as the message being beaned (To make sure an external reaction named "DevBean" doesn't work as a Dev Bean)
      */
      let devBeanEmoji = this.beanManager.getDevBeanEmoji();
      let isInGuild = this.message.guild.emojis.resolve(this._emoji.id) !== undefined;
      if (!devBeanEmoji) return false;
      if (this._emoji.name === devBeanEmoji.name && isInGuild) return true;
      return false;
    }

    isGoldenBeanReaction() {
      /*
        A reaction is considered a Golden Bean Reaction when the emoji name matches the name of the
        "Parent Reaction" (the Golden Bean reaction in the main Dev Launchers server), and when the emoji is from the
        same server as the message being beaned (To make sure an external reaction named "GoldenBean" doesn't work as a Golden Bean)
      */
      let goldenBeanEmoji = this.beanManager.getGoldenBeanEmoji();
      let isInGuild = this.message.guild.emojis.resolve(this._emoji.id) !== undefined;
      if (!goldenBeanEmoji) return false;
      if (this._emoji.name === goldenBeanEmoji.name && isInGuild) return true;
      return false;
    }
  }

  return BeanMessageReaction;
});
