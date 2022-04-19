module.exports = {
  name: "Moderation",
  helpCategory: "Moderation",
  helpPage: 2,
  commands: [
    require("./controllers/commands/ban.js"),
    require("./controllers/commands/clear.js"),
    require("./controllers/commands/kick.js"),
    require("./controllers/commands/kickNonVerified.js"),
    require("./controllers/commands/levels.js"),
    require("./controllers/commands/mute.js"),
    require("./controllers/commands/removewarn.js"),
    require("./controllers/commands/setnickname.js"),
    require("./controllers/commands/guildSettings.js"),
    require("./controllers/commands/teamsrules.js"),
    require("./controllers/commands/unmute.js"),
    require("./controllers/commands/warn.js"),
    require("./controllers/commands/warnings.js"),
  ],
  events: [],
  extends: [],
  structures: [],
  permissions: ["MANAGE_ROLES"],
};
