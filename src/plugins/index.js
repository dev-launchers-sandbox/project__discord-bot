/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared plugins
  require("./.common"),

  // Bean plugin
  require("./Bean"),

  //Reminder plugin
  require("./Reminder"),

  // General plugin
  require("./General"),

  // Minecraft plugin
  require("./Minecraft"),

  // Moderation plugin
  require("./Moderation"),

  // NitroEngine plugin
  require("./NitroEngine"),

  // Thread plugin
  require("./Thread"),

  // Chess plugin
  //require("./Chess"),

  // UtilCommands plugin
  require("./UtilCommands"),

  // Invites plugin
  require("./Invites"),
];
