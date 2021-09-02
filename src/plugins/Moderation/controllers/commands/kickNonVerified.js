const db = require("quick.db");
const { newUserRoles } = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.help = {
  name: "kickNonVerified",
  description: "Kicks all members without the base roles",
  usage: `kickNonVerified`,
  example: `kickNonVerified`,
};
exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: [],
};

exports.run = async (client, message, args) => {
  const { guild, channel, member } = message;
  let nonVerified = [];
  let members = await guild.members.fetch();
  let verifiedRoles = newUserRoles.getRoles(guild.id) || [];

  for (let member of members) {
    if (member[1]._roles.length === 0) nonVerified.push(member[0]);
  }

  try {
    channel.sendEmbed({
      color: 0xff9f01,
      author: { name: "Non-Verified Users" },
      description: nonVerified.map((id) => `<@${id}>`),
    });
  } catch (e) {
    for (let user of verifiedUsers) {
      channel.send(user);
    }
  }

  let confirmationMsg = await channel.send("Do you want to kick all of these users? Y/N");

  confirmationMsg.react("✅");
  confirmationMsg.react("🇽");

  const filter = (reaction, user) => {
    return (
      (reaction.emoji.name === "✅" || reaction.emoji.name === "🇽") && user.id === message.author.id
    );
  };

  const collector = confirmationMsg.createReactionCollector(filter, { max: 1, time: 60000 });

  collector.on("end", (collected) => {
    handleCollected(collected);
  });

  async function handleCollected(collected) {
    if (collected.size === 0) return channel.send("You ran out of time, run the command again");
    if (collected.first()._emoji.name === "✅") {
      channel.send(`Okay! Kicking ${nonVerified.length} members`);
      for (let member of nonVerified) {
        let fetchedMember = await guild.members.fetch(member);
        fetchedMember.kick();
      }
    }
  }
};
