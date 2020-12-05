module.exports = {
  commands: [require("./controllers/commands/poll.js")],
  events: [],
  extends: [require("./extends/PollChannelExtension.js")],
  structures: [],
};
