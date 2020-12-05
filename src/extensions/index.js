/**
 * Provides an array of installed plugins when imported
 */

module.exports = [
  // Common, shared extensions
  require("./.common"),

  // Bean Extension
  require("./Bean"),

  // Poll Extension
  require("./Poll"),
];
