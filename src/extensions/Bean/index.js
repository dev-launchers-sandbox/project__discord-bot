module.exports = {
  commands: [],
  events: [require("./controllers/events/beanReactionAdd.js")],
  extends: [require("./structures/BeanMessageReaction.js")],
  structures: [],
};
