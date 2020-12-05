const Discord = require("discord.js");
const commandUsage = require("../../../utils/commandUsage.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let instancedParentID = db.get(`instanced-category.${message.guild.id}`);
  let categoryExists;
  if (!instancedParentID) {
    return message.channel.send(
      "Administrators have not set up this feature yet!"
    );
  }
  let guildChannels = client.guilds.cache.get(message.guild.id).channels.cache;
  guildChannels.forEach((channel) => {
    if (channel.type === "category" && channel.id === instancedParentID) {
      categoryExists = true;
    }
  });
  if (!categoryExists) {
    return message.channel.send(
      "Umm... It seems like the threads  are not 100% set up"
    );
  }
  createRole(message, args, client);

  function createRole(message, args, client) {
    let channelName = args[0];
    if (args[0] === "public") channelName = args[1];
    const roleExists = message.guild.roles.cache.find(
      (role) => role.name === channelName
    );
    const channelExists = message.guild.channels.cache.find(
      (channel) => channel.name === channelName
    );
    if (!channelName) {
      return commandUsage.missingParams(message, "Name Of Thread", "create");
    }
    if (channelName.length > 100)
      return message.channel.send("Thread names must be lower than 100");

    if (channelExists || roleExists) {
      return message.channel.send(
        "I could not create a thread. Reason: `There is a channel or role with the same name`"
      );
    }
    message.guild.roles
      .create({ data: { name: channelName } })
      .then((role) => createChannel(message, args, role, client))
      .catch((err) => console.log(err));
  }
  async function createChannel(message, args, role, client) {
    let isPublic = false;
    let channelName = args[0];
    if (!channelName) {
      return message.channel.send(
        "I could not create a thread. Reason: `No Name Provided`"
      );
    }
    if (channelName === "public") {
      channelName = args[1];
      isPublic = true;
    }

    await message.guild.channels.create(channelName).then(async (channel) => {
      await channel.updateOverwrite(channel.guild.roles.everyone, {
        VIEW_CHANNEL: false,
      });
      await channel.updateOverwrite(role.id, {
        VIEW_CHANNEL: true,
      });
      channel
        .setParent(instancedParentID)
        .then((channel) =>
          channel.send(
            "`" + message.author.username + "`" + " has created this thread"
          )
        );
      client.guilds.cache
        .find((guild) => guild.id === "736715831962107924")
        .channels.create(channelName)
        .then((channelForMod) => {
          channelForMod.send(
            "`Created by:` " +
              `<@${message.author.id}>` +
              "\n`Role ID:` " +
              role.id +
              "\n`Channel ID:` " +
              channel.id
          );
          createEmbed(message, args, channel, role, channelForMod);
        })
        .catch((err) => console.err);
    });
  }
  //701268417096712203
  //736715831962107924
  function createEmbed(message, args, channel, role, channelForMod) {
    message.channel
      .send(
        "A thread has been created by " +
          "`" +
          message.author.tag +
          "`\n`React` to this message to join the thread.\n These channels are also moderated!"
      )
      .then((msg) =>
        storeChannel(message, msg, args, channel, role, channelForMod)
      );
  }
  async function storeChannel(
    message,
    msg,
    args,
    channel,
    role,
    channelForMod
  ) {
    const directoryChannelId =
      (await db.get(`directory.${message.guild.id}`)) || "None";
    const directoryChannel = message.guild.channels.resolve(directoryChannelId);
    let dirMsgId;
    if (args[0] === "public") {
      if (directoryChannel) {
        const newChannelEmbed = new Discord.MessageEmbed()
          .setColor(0xff9f01)
          .setAuthor(
            `${channel.name} thread`,
            message.guild.iconURL({ dynamic: true })
          )
          .setDescription("*No description*")
          .setFooter("React to this message to join the thread!");

        await directoryChannel.send(newChannelEmbed).then((dirMsg) => {
          dirMsgId = dirMsg.id;
          dirMsg.react("✔️");
        });
      }
    }
    try {
      let channelObj;
      if (dirMsgId) {
        channelObj = channel = {
          id: [msg.id, dirMsgId],
          role: role.id,
          newChannel: channel.id,
          blacklist: [],
          creator: message.author.id,
          channelEmbed: message.channel,
          channelForModeration: channelForMod,
          directoryEntry: dirMsgId,
        };
      } else {
        channelObj = channel = {
          id: [msg.id],
          role: role.id,
          newChannel: channel.id,
          blacklist: [],
          creator: message.author.id,
          channelEmbed: message.channel,
          channelForModeration: channelForMod,
        };
      }
      let channelsCreated =
        (await db.get(`instanced.${message.guild.id}`)) || [];
      channelsCreated.push(channelObj);
      db.set(`instanced.${message.guild.id}`, channelsCreated);
      msg.react("✔️");
    } catch (error) {
      console.error(error);
    }
  }
};

exports.help = {
  name: "create",
  description:
    "Create an thread! Public threads will show in the directory channel!",
  usage: "create [public] <threadName>",
  example: "createInstanced public gamenight",
};

exports.conf = {
  aliases: ["createthread"],
  cooldown: 5,
};

//736715831962107924 FINAL
