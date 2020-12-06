module.exports = {
  name: "Poll",
  helpCategory: "Other",
  commands: [require("./controllers/commands/poll.js")],
  events: [],
  extends: [require("./extends/PollChannelExtension.js")],
  structures: [],
};
