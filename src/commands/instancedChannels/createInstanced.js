const Discord = require("discord.js");
const commandUsage = require("../../utils/commandUsage.js");
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
      "Umm... It seems like the instanced channels are not 100% set up"
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
      return commandUsage.missingParams(
        message,
        "Name Of Channel",
        "createinstanced"
      );
    }
    if (channelExists || roleExists) {
      return message.channel.send(
        "I could not create an instanced channel. Reason: `There is a channel or role with the same name`"
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
        "I could not create an instanced channel. Reason: `No Name Provided`"
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
            "`" + message.author.username + "`" + " has created this channel"
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

  function createEmbed(message, args, channel, role, channelForMod) {
    message.channel
      .send(
        "A instanced channel has been created by " +
          "`" +
          message.author.tag +
          "`\n`React` to this message to join the instanced channel.\n These channels are also moderated!"
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
            "New public instanced channel: " + args[1],
            message.guild.iconURL({ dynamic: true })
          )
          .setDescription("React to this message to join!")
          .setTimestamp();

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
  name: "createinstanced",
  description: "Create an instanced channel!",
  usage: "createInstanced <channelName>",
  example: "createInstanced gamenight",
};

exports.conf = {
  aliases: ["create", "createinstance", "createchannel"],
  cooldown: 5,
};

//736715831962107924 FINAL