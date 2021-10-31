const Discord = require("discord.js");
const { Structures } = require("discord.js");

Structures.extend("User", (User) => {
  class UserExtension extends User {
    constructor(client, data) {
      super(client, data);
    }
  }

  return UserExtension;
});
