const db = require("quick.db");

function attributeTags(message, args) {
  console.log(message.content);
  if (message.author.bot) return;
  const content = message.content;
  let tags = [];

  args.forEach((arg) => {
    if (!arg.includes("+")) return;
    if (!verifyTag(message, arg)) return;
    tags.push(arg);
  });

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
