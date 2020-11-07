const User = require("./User");

module.exports = class UserRepository {
  // dependency injection - pass database access object to constructor
  constructor(db) {
    this.db = db;
  }

  // TODO: Check how we're accessing user object here - just guessing!
  // TODO: Check if all of this data is available in the user data object in the db
  getById(id) {
    const userData = this.db.get(`account.${id}`);
    return new User(userData.id, userData.name, userData.joinDate);
  }

  // TODO: Check how we're accessing user object here - just guessing!
  // TODO: Check if all of this data is available in the user data object in the db
  getByName(name) {
    const userData = this.db.get(`account.${name}`);
    return new User(userData.id, userData.name, userData.joinDate);
  }
};
