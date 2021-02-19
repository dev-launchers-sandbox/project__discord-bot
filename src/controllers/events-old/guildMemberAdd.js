const updateCounters = require("../../utils/updateCounters.js");
const metrics = require("../../index.js");
const db = require("quick.db");

module.exports = async(client, member) => {
    metrics.sendEvent("guild_member_add");
    updateCounters.updateCounters(member, client);
    sendWelcomeEmbed(member);
};

function sendWelcomeEmbed(member) {
    let welcomeChannelID = db.get(`welcome.${member.guild.id}`);
    if (!welcomeChannelID) return;

    const welcomeChannel = member.guild.channels.resolve(welcomeChannelID);
    if (!welcomeChannel) return;

    let avatar = member.user.displayAvatarURL({ size: 2048 });
    let icon = member.guild.iconURL({ size: 2048, dynamic: true });

    if (!welcomeChannel) return;

    welcomeChannel.sendEmbed({
        color: 0xff9f01,
        author: { name: `${member.user.tag}`, image: avatar },
        description: `Welcome to DevLaunchers **${member.user.username}**`,
        footer: { text: ` | ${member.id}`, image: icon }
    });
    welcomeChannel.send(member.user.toString()).then((m) => m.delete());

    let controlCenterID = db.get(`control-center.${member.guild.id}`) || "null";
    let controlChannel = member.guild.channels.resolve(controlCenterID);
    if (!controlChannel) return;

    controlChannel.send(member.user.toString()).then((m) => m.delete());
}