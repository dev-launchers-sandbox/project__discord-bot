const dbh = require("../../.common/structures/DataHandling/DatabaseHandler.js");

class CurrencyManager {
  constructor() {}

  addCoins(userId, amount) {
    dbh.currency.addCoins(userId, amount);
  }

  removeCoins(userId, amount) {
    dbh.currency.removeCoins(userId, amount);
  }

  getCoins(userId) {
    return dbh.currency.getCoins(userId);
  }
}

module.exports = new CurrencyManager();
