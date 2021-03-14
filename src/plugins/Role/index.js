module.exports = {
  name: "Role",
  helpCategory: "Roles",
  helpPage: 3,
  commands: [
    require("./controllers/commands/iam.js"),
    require("./controllers/commands/iamnot.js"),
    require("./controllers/commands/getRoles.js"),
  ],
  events: [],
  extends: [],
  structures: [],
  permissions: [],
};
