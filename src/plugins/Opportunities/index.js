module.exports = {
  name: "Opportunities",
  helpCategory: "General",
  helpPage: 1,
  commands: [require("./controllers/commands/createOpportunity.js")],
  events: [],
  extends: [],
  structures: ["./structures/Opportunity.js"],
  permissions: [],
};
