module.exports = {
    name: "Leveling",
    helpCategory: "Leveling",
    helpPage: 1,
    commands: [
        require("./controllers/commands/profile.js"),
        require("./controllers/commands/cycle.js"),
    ],
    events: [],
    extends: [],
    structures: [],
    permissions: [],
};