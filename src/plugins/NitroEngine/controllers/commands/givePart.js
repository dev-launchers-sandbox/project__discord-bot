const Discord = require("discord.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

const messageTargetUtil = require("../../../../utils/getMessageTarget");
const PartInventory = require("../../structures/PartInventory.js");

exports.help = {
  name: "givePart",
  description: "Give a Nitro Engine part to another user",
  usage: "givePart <recipient> <partType>",
  example: "givePart @pyxld_kris Piston",
};

exports.conf = {
  aliases: ["sendPart"],
  cooldown: 5,
  permissions: [],
  arguments: ["Recipient", "Part Type"],
};

exports.run = async (client, message, args) => {
  let channel = message.channel;
  let user = message.author;

  let target = messageTargetUtil.getMessageTarget(message, args);
  if (!target) {
    channel.send("I can't figure out who you want to send this to.");
    return;
  }

  let partType = args.slice(1).join(" ");

  let senderPartInventory = new PartInventory(dbh, client, user.id);
  let recipientPartInventory = new PartInventory(dbh, client, target.user.id);

  if (!senderPartInventory.checkPartExistsByType(partType)) {
    channel.send(`It doesn't look like you own one of those! (${partType})`);
    return;
  }

  senderPartInventory.removePartByType(partType);
  recipientPartInventory.addPartByType(partType);

  channel.sendEmbed({
    //author: user.id,
    color: 0xff9f01,
    title: `⚙ Your Nitro Engine part (${partType}) has been sent to ${target.user.tag}!`,
  });
};
