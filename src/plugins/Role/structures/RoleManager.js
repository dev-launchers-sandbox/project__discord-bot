const POSSIBLE_ROLES = [
  "Coding Helper",
  "Game Dev Helper",
  "Art Helper",
  "Music Helper",
];

class RoleManager {
  constructor(dbh, client) {
    this.dbh = dbh;
    this.client = client;
  }

  getPossibleRoles() {
    return POSSIBLE_ROLES;
  }

  getRoleFromName(guild, roleName) {
    let filteredPossibleRoles = this.getPossibleRoles().filter((str) =>
      str.toLowerCase().includes(roleName.toLowerCase())
    );
    roleName = filteredPossibleRoles[0];
    if (filteredPossibleRoles.length != 1) return undefined;
    return guild.roles.cache.find((role) => role.name == roleName);
  }
}

module.exports = RoleManager;
