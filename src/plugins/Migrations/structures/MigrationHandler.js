const db = require("quick.db");

class MigrationHandler {
  constructor() {}

  copyData(keys) {
    let copiesObject = {};
    for (const key of keys) {
      const dbValue = db.get(key.oldKey);
      if (dbValue) copiesObject[key.newKey] = dbValue;
    }
    return copiesObject;
  }
}

module.exports = new MigrationHandler();
