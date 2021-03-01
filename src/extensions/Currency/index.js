module.exports = {
  name: "Currency",
  helpCategory: "Currency",
  helpPage: 3,
  commands: [require("./controllers/commands/template.js")],
  events: [],
  extends: [],
  structures: [require("./structures/CurrencyManager.js")],
  permissions: [],
};
