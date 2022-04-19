module.exports = {
  name: ".common",
  helpCategory: "Common",
  commands: [],
  events: [
    require("./controllers/events/onGuildCreate.js"),
    require("./controllers/events/onGuildDelete.js"),
  ],
  extends: [
    require("./extends/GuildExtension.js"),
    require("./extends/MessageExtension.js"),
    require("./extends/TextChannelExtension.js"),
    require("./extends/UserExtension.js"),
  ],
  structures: [],
};
