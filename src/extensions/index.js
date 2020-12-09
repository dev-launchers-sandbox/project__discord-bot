/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared extensions
  require("./.common"),

  // Bean Extension
  require("./Bean"),

  // General Extension
  require("./General"),

  // Minecraft Extension
  require("./Minecraft"),

  // Moderation Extension
  require("./Moderation"),

  // Minecraft Extension
  require("./Threads"),

  // UtilCommands Extension
  require("./UtilCommands"),
];
