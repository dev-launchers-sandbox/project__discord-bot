/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared extensions
  require("./.common"),

  // Bean Extension
  require("./Bean"),

  //Reminder Extension
  require("./Reminder"),

  // General Extension
  require("./General"),

  // Minecraft Extension
  require("./Minecraft"),

  // Moderation Extension
  require("./Moderation"),

  // Threads Extension
  require("./Threads"),

  // Chess Extension
  require("./Chess"),

  // UtilCommands Extension
  require("./UtilCommands"),

  // Invites Extension
  require("./Invites"),
];
