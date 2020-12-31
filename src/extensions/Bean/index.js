module.exports = {
  name: "Bean",
  helpCategory: "Beans",
  commands: [],
  events: [require("./controllers/events/beanOnReactionAdd.js")],
  extends: [require("./structures/BeanMessageReaction.js")],
  structures: []
};
