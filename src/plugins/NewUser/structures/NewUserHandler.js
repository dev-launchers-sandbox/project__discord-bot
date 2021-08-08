const db = require("quick.db");
const { newUserRoles } = require("./../../.common/structures/DataHandling/DatabaseHandler.js");

class NewUserHandler {
  constructor() {}

  giveRoles(message) {
    let { guild, channel, member } = message;

    if (message.author.bot) return; //Ignore bots.
    let introductionsChannel = db.get(`introductions-channel.${guild.id}`);

    if (channel.id === (introductionsChannel && introductionsChannel.toString())) {
      let roles = newUserRoles.getRoles(message.guild.id);

      /*
      If the length of the content of the message is greater than 40, give the user the roles, if not,
      tell them to fix it.
      */
      if (message.content.length > 40) {
        for (let role of roles) {
          if (!member.roles.cache.find((r) => r.id === role)) {
            sendWelcomeEmbed(member);
            break;
          }
        }
        for (let role of roles) {
          message.member.roles.add(role);
        }
        return;
      } else {
        /*
        If the user does not has all of the roles they would get from posting an introduction, refrain from sending
        them a DM
        */
        for (let role of roles) {
          if (!member.roles.cache.find((r) => r.id === role)) {
            member.send("Your introduction must at least contain 40 characters!");
            break;
          }
        }
      }
    }
  }
}

function sendWelcomeEmbed(member) {
  let welcomeChannelID = db.get(`welcome.${member.guild.id}`) || "none";
  const welcomeChannel = member.guild.channels.resolve(welcomeChannelID);
  if (!welcomeChannel) return;
  let icon = member.guild.iconURL({ size: 2048, dynamic: true });
  let avatar = member.user.displayAvatarURL({ size: 2048 });

  welcomeChannel.sendEmbed({
    color: 0xff9f01,
    author: { name: `${member.user.tag}`, image: avatar },
    description: `Welcome to DevLaunchers **${member.user.username}**`,
    footer: { text: ` | ${member.id}`, image: icon },
  });
  welcomeChannel.send(member.user.toString()).then((m) => m.delete());

  let controlCenterID = db.get(`control-center.${member.guild.id}`) || "none";
  let controlChannel = member.guild.channels.resolve(controlCenterID);
  if (!controlChannel) return;

  controlChannel.send(member.user.toString()).then((m) => m.delete());
}

module.exports = new NewUserHandler();
