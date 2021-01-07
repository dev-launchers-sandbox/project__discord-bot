const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("TextChannel", (TextChannel) => {
  class TextChannelExtension extends TextChannel {
    constructor(guild, data) {
      super(guild, data);
    }

    sendEmbed(args) {
      const embed = new Discord.MessageEmbed();
      if (args.color) embed.setColor(args.color);
      if (args.thumbnail) embed.setThumbnail(args.thumbnail);
      if (args.url) embed.setURL(args.url);

      if (args.title) embed.setTitle(args.title);
      if (args.author)
        embed.setAuthor(
          args.author.name,
          args.author.image && args.author.image
        );

      if (args.description) embed.setDescription(args.description);
      if (args.fields) {
        args.fields.map((field) =>
          embed.addField(field.name, field.value, field.inline)
        );
      }

      if (args.footer) embed.setFooter(args.footer);
      if (args.timestamp) embed.setTimestamp(args.timestamp);
      if (args.image) embed.setImage(args.image);
      return this.send(embed);
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

  return TextChannelExtension;
});
