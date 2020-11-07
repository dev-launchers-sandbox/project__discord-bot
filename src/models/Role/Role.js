module.exports = class Role {
  constructor(id, name, color, permissions) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.permissions = permissions;
  }
};
