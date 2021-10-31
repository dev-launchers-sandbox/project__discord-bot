const TestPluginHandler = require("./../../structures/TestPluginHandler.js");
const testPluginHandler = new TestPluginHandler(1, 3);
/*
Welcome to the testCommand, where you will create your first (of many) commands!
Edit the code below to create MAGIC ✨
*/

//action-message: I word I just made up that refers to the message sent by the user that caused
//the command to execute

exports.help = {
  name: "testCommand", //Name of the command, not case sensitive
  description: "A very cool command!", //Description of the command
  usage: "testCommand [text]", //How to use the command [optional] <required>
  example: "testCommand potato!", //An example of what an action-message could look like
};

exports.conf = {
  //Array with the arguments needed for the command
  //This prevents the command from being executed if the action-message does not contain the arguments neede
  arguments: [],
  //Array containing the multiple different ways a command can be executed with.
  //In this case, .example would also execute the command.
  aliases: ["example"],
};

//The code to be executed!
exports.run = async (client, message, args) => {
  //args are the arguments passed in the action-message. It is an array containing each word sent with
  //the command
  const text = args[0];

  if (text == null) {
    message.channel.send("Hello World 👋");
  } else {
    message.channel.send(text);
  }

  testPluginHandler.addInterval();
  console.log(testPluginHandler.getCount());
};
