module.exports = {
  name: "Poll",
  helpCategory: "Poll",
  commands: [require("./controllers/commands/poll.js")],
  events: [],
  extends: [require("./extends/PollChannelExtension.js")],
  structures: [],
};
