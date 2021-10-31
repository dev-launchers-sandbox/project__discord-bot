/*
1. name: Name of the plugin (must match the name of the plugin folder)

2. helpCategory: The name of the category where the commands will be shown when the help command is run

3. helpPage: A value given to each plugin that dictates where in the help command the category will be placed.
Low numbers will be placed on top and high numbers will be placed below.

4. commands: An array containing the commands being actively used by the plugin.

5. events: The event handlers used by the plugin

6. extends: An array containing the Discord.js structures that are being extended by and for the plugin

7. structures: An array containing the custom structures used by the plugin.

8. permissions: An array containing the roles (discord.js format) a user must have to be able to run any of
the commands in the plugin
*/

/*
NOTE: Fields 5-8 may be empty arrays, as there won't be always be events, commands, structures,
or extensions used by the plugin.
Fields 5-8 must be an array of "require()"
If you want a command, structure etc. to be used it MUST be specified in this file. If a command, structure
is not required it will be completely ignored by the bot.
*/

module.exports = {
  name: "TestPlugin",
  helpCategory: "Test Plugin Category",
  helpPage: 1,
  commands: [
    require("./controllers/commands/help.js"),
    require("./controllers/commands/testCommand.js"),
  ],
  events: [require("./controllers/events/testOnReactionAdd.js")],
  extends: [],
  structures: [require("./structures/TestPluginHandler.js")],
  permissions: [],
};
