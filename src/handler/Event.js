const { readdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsFolder = path.join(__dirname, "../events/");
  const events = readdirSync(eventsFolder);
  for (let event of events) {
    let file = require(`../events/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};
