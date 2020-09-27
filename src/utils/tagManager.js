const db = require("quick.db");
const commandUsage = require("./commandUsage.js");

async function attributeTags(message, args) {
  if (message.author.bot) return;
  const privateTags = await db.get(`privateTags.${message.guild.id}`);
  const content = message.content;
  let tags = [];

  args.forEach((arg) => {
    if (!arg.includes("+")) return;
    if (!verifyTag(message, arg)) return;
    tags.push(arg);
  });

  if (privateTags && tags.some((tag) => privateTags.includes(tag.substring(1))))
    if (await blockTags(message, args)) return;

  tags.forEach((tag) => {
    addTag(message, tag);
  });
}

exports.attributeTags = attributeTags;

function verifyTag(message, arg) {
  if (arg.length < 3) return false;
  if (arg.length > 20) return false;
  if (arg.charAt(0) !== "+") return false;
  return true;
}

async function addTag(message, tag) {
  const content = message.content;
  const cleanTag = tag.substring(1);

  await db.push(`tag.${message.guild.id}.${cleanTag}`, {
    author: message.author.id,
    content: content,
  });
  message.react("👍");
}

async function blockTags(message, args) {
  let modRoleID = await db.get(`moderator.${message.guild.id}`);
  if (!modRoleID) modRoleID = "notSet"; //Prevents error from happening on line 12
  if (
    message.member.hasPermission("ADMINISTRATOR") ||
    message.member.roles.cache.has(modRoleID)
  ) {
    return false;
  }
  message.react("❌");
  message
    .reply(
      "Your message does not have any tags attached to it because unfortunetely, one of the tags you used was private"
    )
    .then((msg) => commandUsage.deleteMsg(msg, 10000));
  setTimeout(() => {
    message.reactions.removeAll();
  }, 10000);
  return true;
}
