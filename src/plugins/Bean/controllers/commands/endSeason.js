

exports.help = {
  name: "endSeason",
  description: "Ends the current bean season",
  usage: `endSeason`,
  example: `endSeason`,
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

exports.run = async (client, message, args) => {
  const { channel } = message;

  channel.send("Starting the process of ending the season.");
  const accounts = db.get("account");
  channel.send(`Found ${accounts.length} accounts`);
  if (!accounts) return;

  channel.send("Preparing to remove beans");
  let count = 0;
  Object.keys(accounts).forEach((userId) => {
    message.channel.send(`Removed beans for user with id ${userId}`);
    db.delete(`account.${userId}.devBeansTwo`);
    db.delete(`account.${userId}.goldenBeansTwo`);
    count++;
  });

  message.channel.send(`Deleted the beans of ${count} users`);
};
