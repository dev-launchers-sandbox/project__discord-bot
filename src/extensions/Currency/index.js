module.exports = {
  name: "Currency",
  helpCategory: "Currency",
  helpPage: 3,
  commands: [
    require("./controllers/commands/addCoins.js"),
    require("./controllers/commands/balance.js"),
    require("./controllers/commands/removeCoins.js"),
  ],
  events: [],
  extends: [],
  structures: [require("./structures/CurrencyManager.js")],
  permissions: [],
};
