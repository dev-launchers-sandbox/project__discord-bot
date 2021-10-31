const { readdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
  //Loads the plugins
  const plugins = require("../plugins");
  for (let plugin of plugins) {
    for (let event of plugin.events) {
      let eventHandle = event.eventHandle;
      client.on(eventHandle, (...args) => event.event(client, ...args));
    }
  }
};
