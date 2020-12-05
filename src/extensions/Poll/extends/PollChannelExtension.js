const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("TextChannel", (TextChannel) => {
  class PollChannelExtension extends TextChannel {
    constructor(guild, data) {
      super(guild, data);
    }

    sendPoll(args) {
      return this.sendEmbed({
        title: "📝 " + "**" + args.subject + "**",
        description: "Poll initated by " + args.author,
        color: 0xff9f01,
      }).then((msgReaction) => {
        msgReaction.react("👍");
        msgReaction.react("👎");
      });
    }
  }

  return PollChannelExtension;
});
