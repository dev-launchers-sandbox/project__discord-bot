module.exports = {
  name: "Opportunities",
  helpCategory: "General",
  helpPage: 1,
  commands: [
    require("./controllers/commands/createOpportunity.js"),
    require("./controllers/commands/startOpportunity.js"),
  ],
  events: [],
  extends: [],
  structures: ["./structures/Opportunity.js"],
  permissions: [],
};
