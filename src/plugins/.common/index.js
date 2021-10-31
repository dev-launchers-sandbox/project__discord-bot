module.exports = {
  name: ".common",
  helpCategory: "Common",
  commands: [],
  events: [require("./events/ready.js"), require("./events/message.js")],
  extends: [
    require("./extends/GuildExtension.js"),
    require("./extends/MessageExtension.js"),
    require("./extends/TextChannelExtension.js"),
    require("./extends/UserExtension.js"),
  ],
  structures: [],
};
