module.exports = {
  name: "Bean",
  helpCategory: "Beans",
  commands: [],
  events: [require("./controllers/events/beanReactionAdd.js")],
  extends: [require("./structures/BeanMessageReaction.js")],
  structures: [],
};
