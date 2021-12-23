const Opportunity = require("./../../structures/Opportunity.js");

exports.help = {
  name: "createOpportunity",
  description: "Create an opportunity in the #opportunity channel",
  usage: "createOpportunity",
  example: "createOpportunity",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: [],
};

exports.run = async (client, message, args) => {
  const { author } = message;

  const embed = {
    color: 0xff9f01,
    author: {
      name: "💡 Welcome to the Opportunity Creation Guide! ",
    },
    description:
      "This guide will walk you through creating an opportunity!\n" +
      "**What is an opportunity?**\n" +
      "Opportunities are the best way to find a team to build the project you envision. They can be created for a wide range of projects, that vary from paid opportunities to volunteer offers and game jams.\n\n" +
      "**How do I create an opportunity?**\n" +
      "To create an opportunity, run the `startOpportunity` in one of the public channels. I will then ask you to fill out the following fields:\n" +
      "1) Project Name\n2) Position Offered\n3) Pay [Optional]\n4) Description\n5) Contact Data\n6) Image [Optional]\n7) Extra Information [Optional]\n\n" +
      "**Special Keywords:\n**" +
      "`cancel:` Cancels the current process\n" +
      "`skip:` Skips the current field, only if the field is optional\n" +
      "`back:` Goes back to the previous field, useful when you change your find.\n\n" +
      "**Reviewing:\n**" +
      "After filling out all the fields, you will get a chance to review your opportunity and to make any changes you want!\n\n" +
      "**Posting:\n**" +
      "Once you are done, the opportunity will be automatically posted in the server!\n\n" +
      "To create the opportunity, run the `startOpportunity` command! If you need any help, feel free to contact the mod team.",
  };
  author.sendEmbed(embed);
};
