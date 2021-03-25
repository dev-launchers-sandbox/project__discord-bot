module.exports = {
  name: "Minecraft",
  helpCategory: "Minecraft",
  helpPage: 4,
  commands: [require("./controllers/commands/minecraft.js")],
  events: [require("./controllers/events/minecraftOnGuildMemberUpdate.js")],
  extends: [],
  structures: [],
  permissions: [],
};
