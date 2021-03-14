class InviteHandler {
  constructor() {
    this.guildInvites = new Map();
  }

  fetchInvites(client) {
    client.guilds.cache.forEach((guild) => {
      guild
        .fetchInvites()
        .then((invites) => this.guildInvites.set(guild.id, invites))
        .catch((err) => console.log(err));
    });
  }

  async findInviteUsed(member) {
    const cachedInvites = this.guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    this.guildInvites.set(member.guild.id, newInvites);
    try {
      const usedInvite = newInvites.find(
        (inv) => cachedInvites.get(inv.code).uses < inv.uses
      );
      return usedInvite;
    } catch (err) {
      console.log(err);
    }
  }

  async fetchNewInvite(invite) {
    this.guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
  }

  getInvite(guildId, code) {
    let inviteGuild = this.guildInvites.get(guildId);
    if (!inviteGuild) return;
    return inviteGuild.get(code);
  }
}

module.exports = new InviteHandler();
