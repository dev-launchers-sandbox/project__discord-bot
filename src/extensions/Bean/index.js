module.exports = {
  name: "Bean",
  helpCategory: "Beans",
  commands: [
    require("./controllers/commands/beans.js"),
    require("./controllers/commands/deleteLeaves.js"),
    require("./controllers/commands/devBeanCooldown.js"),
    require("./controllers/commands/endSeason.js"),
    require("./controllers/commands/goldenBeanCooldown.js"),
    require("./controllers/commands/leaderboard.js"),
  ],
  events: [require("./controllers/events/beanOnReactionAdd.js")],
  extends: [require("./structures/BeanMessageReaction.js")],
  structures: [],
  permissions: [],
};
