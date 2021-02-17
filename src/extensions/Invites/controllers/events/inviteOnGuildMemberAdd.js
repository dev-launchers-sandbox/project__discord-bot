const inviteHandler = require("./../../structures/InviteHandler.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");

module.exports.eventHandle = "guildMemberAdd";
module.exports.event = async (client, member) => {
	const invite = await inviteHandler.findInviteUsed(member);

	let inviteChannelID = dbh.invite.getInviteChannel(member.guild.id);
	let inviteChannel = member.guild.channels.resolve(inviteChannelID || "0");
	if (!inviteChannel) return;

	let newMember = member.user.tag;
	let avatar = member.user.avatarURL({ size: 2048 });

	let code = invite.code;
	let uses = invite.uses;
	let inviter = invite.inviter.tag;

	let invites = dbh.invite.getInvites(member.guild.id);

	let name = null;
	Object.keys(invites).forEach((dbName) => {
		let dbCode = dbh.invite.getInvite(member.guild.id, dbName);
		if (dbCode === code) {
			name = dbName;
			return;
		}
	});

	if (name) {
		inviteChannel.sendEmbed({
			color: 0xff9f01,
			author: {
				name: `${newMember} joined using the ${name} invite`,
				image: avatar,
			},
			description: `Invite: **${code}**\nNum of Uses: **${uses}**`,
		});
	} else {
		inviteChannel.sendEmbed({
			color: 0xff0000,
			author: {
				name: `${newMember} joined using ${inviter}'s invite`,
				image: avatar,
			},
			description: `Invite: **${code}**\nNum of Uses: **${uses}**`,
		});
	}
};
