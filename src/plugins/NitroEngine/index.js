module.exports = {
  name: "NitroEngine",
  helpCategory: "Nitro Engines",
  helpPage: 3,
  commands: [
    require("./controllers/commands/craftEngine.js"),
    require("./controllers/commands/givePart.js"),
    require("./controllers/commands/myEngines.js"),
    require("./controllers/commands/myParts.js"),
  ],
  events: [
    require("./controllers/events/nitroEngineOnMessage.js"),
    require("./controllers/events/nitroEngineOnMessageReactionAdd.js"),
    require("./controllers/events/nitroEngineOnReady.js"),
  ],
  extends: [],
  structures: [
    require("./structures/EngineInventory.js"),
    require("./structures/NitroEngine.js"),
    require("./structures/nitroEngineAssembler.js"),
    require("./structures/NitroEnginePart.js"),
    require("./structures/PartBox.js"),
    require("./structures/PartInventory.js"),
  ],
  permissions: [],
};
