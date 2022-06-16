module.exports = {
  name: "Migrations",
  helpCategory: "Migrations",
  helpPage: 5,
  commands: [require("./controllers/commands/migrateGuilds.js")],
  events: [],
  extends: [],
  structures: [require("./structures/MigrationHandler.js")],
  permissions: ["ADMINISTRATOR"],
};
