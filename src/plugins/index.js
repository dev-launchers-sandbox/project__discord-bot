/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared plugins
  require("./.common"),

  // Bean plugin
  require("./Bean"),

  // General plugin
  require("./General"),

  // Minecraft plugin
  require("./Minecraft"),

  // Moderation plugin
  require("./Moderation"),

  //NewUser plugin
  require("./NewUser"),

  //Opportunities plugin
  require("./Opportunities"),
  //Reminder plugin
  require("./Reminder"),

  //Role plugin
  require("./Role"),

  // Thread plugin
  //require("./Thread"),

  // Chess plugin
  //require("./Chess"),

  // UtilCommands plugin
  require("./UtilCommands"),

  // Invites plugin
  require("./Invites"),
];
