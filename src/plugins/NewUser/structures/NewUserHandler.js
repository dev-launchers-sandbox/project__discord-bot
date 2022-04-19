const dbh = require("./../../.common/structures/DataHandling/DatabaseHandler.js");
const { newUserRoles } = require("./../../.common/structures/DataHandling/DatabaseHandler.js");

class NewUserHandler {
  constructor() {}

  async giveRoles(client, message) {
    let { guild, channel, member } = message;

    if (!guild) return;
    if (message.author.bot) return; //Ignore bots.
    const introductionsChannel = await dbh.channels.getIntroductions(guild.id);

    if (channel.id === introductionsChannel) {
      const roles = await dbh.guild.getDefaultMemberRoles(guild.id);
      //If the user already has every role that would be given to them, ignore the msg.
      if (roles.every((r) => member.roles.cache.find((role) => role.id === r.id))) return;

      //Introductions must be > 40 in length in order to be allowed.
      if (message.content.length < 40) {
        member.send("Your introduction must at least contain 40 characters!");
        return;
      }

      for (const roleId of roles) {
        //Check if the role with the id provided exists in the guild.
        const role = guild.roles.resolve(roleId);
        if (!role) return;
        if (!role.editable) return; //Check if the client (bot) has permission to give the role.
        member.roles.add(role);
      }
      //member.roles.add(roles);
      sendWelcomeEmbed(member, guild.id);
    }
  }
}

async function sendWelcomeEmbed(member, guildId) {
  let welcomeChannelID = dbh.channels.getWelcome(guildId);
  const welcomeChannel = member.guild.channels.resolve(welcomeChannelID);
  if (!welcomeChannel) return;
  let icon = member.guild.iconURL({ size: 2048, dynamic: true });
  let avatar = member.user.displayAvatarURL({ size: 2048 });

  const USER_PING = `<${member.user.id}>`;
  welcomeChannel.sendEmbed({
    color: 0xff9f01,
    author: { name: `${member.user.tag}`, image: avatar },
    description: `Welcome to DevLaunchers **${member.user.username}**`,
    footer: { text: ` | ${member.id}`, image: icon },
  });
  welcomeChannel.send(USER_PING).then((m) => m.delete());

  for (const channelId of await dbh.channel.getNewUserMention(guildId)) {
    const channel = member.guild.channels.resolve(channelId);
    if (!channel) return;
    channel.send(USER_PING).then((m) => m.delete());
  }
}

module.exports = new NewUserHandler();
