const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const metrics = require("../../../../index.js");

const NitroEnginePartDropper = require("../../structures/NitroEnginePartDropper.js");

const DROP_CHANCE_PER_MESSAGE = 0.5;
const DROP_DELAY_MIN = 1000 * 5; // in milliseconds
const DROP_DELAY_MAX = 1000 * 60; // in milliseconds
function getRandomDropDelay() {
  return (
    DROP_DELAY_MIN + parseInt(Math.random() * (DROP_DELAY_MAX - DROP_DELAY_MIN))
  );
}

function updateUserLastMessageTime(user) {
  dbh.nitroEngine.setUserLastMessageTime(user.id, Date.now());
}

exports.eventHandle = "message";
exports.event = async (client, message, args) => {
  metrics.sendEvent("message");

  updateUserLastMessageTime(message.author);

  if (Math.random() * 100 < DROP_CHANCE_PER_MESSAGE) {
    let channel = message.channel;
    setTimeout(() => {
      let partDropper = new NitroEnginePartDropper(dbh, client);
      partDropper.dropRandomPart(channel);
    }, getRandomDropDelay());
  }
};
