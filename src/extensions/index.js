/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared extensions
  require("./.common"),

  // Bean Extension
  require("./Bean"),

  // Chess Extension
  //require("./Chess"),

  //Currency Extension
  //require("./Currency"),

  // General Extension
  require("./General"),

  // Invites Extension
  require("./Invites"),

  // Minecraft Extension
  require("./Minecraft"),

  // Moderation Extension
  require("./Moderation"),

  //Reminder Extension
  require("./Reminder"),

  // Thread Extension
  require("./Thread"),

  // UtilCommands Extension
  require("./UtilCommands"),
];
