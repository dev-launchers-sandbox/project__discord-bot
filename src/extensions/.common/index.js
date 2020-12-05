module.exports = {
  commands: [],
  events: [],
  extends: [
    require("./extends/GuildExtension.js"),
    require("./extends/MessageExtension.js"),
    require("./extends/TextChannelExtension.js"),
    require("./extends/UserExtension.js"),
  ],
  structures: [],
};
