module.exports = {
    name: "Chess",
    helpCategory: "Chess",
    helpPage: 1,
    commands: [
        require("./controllers/commands/abort.js"),
        require("./controllers/commands/challenge.js"),
        require("./controllers/commands/listGames.js"),
        require("./controllers/commands/move.js"),
    ],
    events: [],
    extends: [],
    structures: [],
    permissions: [],
};