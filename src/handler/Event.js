const { readdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
  // New events
  const extensions = require("../extensions");
  for (let extension of extensions) {
    for (let event of extension.events) {
      let eventHandle = event.eventHandle;
      console.log("Hooking into " + eventHandle);
      client.on(eventHandle, (...args) => event.event(client, ...args));
    }
  }

  // Old events
  const eventsFolder = path.join(__dirname, "../controllers/events-old/");
  const oldEvents = readdirSync(eventsFolder);
  for (let event of oldEvents) {
    let file = require(`../controllers/events-old/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};
