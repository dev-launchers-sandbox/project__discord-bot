module.exports = {
  name: "Bean",
  helpCategory: "Beans",
  helpPage: 3,
  commands: [
    require("./controllers/commands/beans.js"),
    require("./controllers/commands/endSeason.js"),
    require("./controllers/commands/leaderboard.js"),
  ],
  events: [require("./controllers/events/beanOnReactionAdd.js")],
  extends: [require("./extends/BeanMessageReaction.js")],
  structures: [],
  permissions: [],
};
