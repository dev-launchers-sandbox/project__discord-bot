const ThreadManager = require("./../../structures/ThreadManager.js");

exports.run = async (client, message, args) => {
  let isPublic = args[0] !== "private";
  let threadCreatorId = message.author.id;
  if (["public", "private"].includes(args[0])) args.shift();
  let threadName = args.join("-");

  threadName = threadName.replace(/[^A-z0-9-]/g, "");

  if (threadName.length > 30) {
    message.channel.sendEmbed({
      color: 0xff9f01,
      description: `Thread names have a max of **30** characters. Please make your name ${threadName.length- 30} smaller`,
    });
    return;
  }

  if (message.guild.channels.cache.find((c) => c.name === threadName)) {
    message.channel.sendEmbed({ color: 0xff9f01, description: "There is a channel in the server with the same name." });
    return;
  }

  if (message.guild.roles.cache.find((r) => r.name === threadName)) {
    message.channel.sendEmbed({ color: 0xff9f01, description: "There is a role in the server with the same name." });
    return;
  }

  ThreadManager.createThread(
    client,
    message.guild,
    message.channel,
    threadName,
    threadCreatorId,
    isPublic
  );
};

exports.help = {
  name: "create",
  description: "Create an thread! Public threads will show in the directory channel!",
  usage: "create [public or private] <threadName>",
  example: "createInstanced public gamenight",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  arguments: ["Thread Name"],
};
