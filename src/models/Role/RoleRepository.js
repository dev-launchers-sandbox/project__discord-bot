const User = require("./User");

module.exports = class RoleRepository {
  // dependency injection - pass database access object to constructor
  constructor(db, guild) {
    this.db = db;
    this.guild = guild;
  }

  getById(id) {
    const role = this.guild.roles.filter((role) => role.id == id)[0];
    return new Role(role.id, role.name, role.color, role.permissions);
  }

  getByName(name) {
    const role = this.guild.roles.filter((role) => role.name == name)[0];
    return new Role(role.id, role.name, role.color, role.permissions);
  }
};
