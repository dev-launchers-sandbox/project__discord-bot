module.exports = {
    name: "UtilCommands",
    helpCategory: "Utils",
    helpPage: 4,
    commands: [
        require("./controllers/commands/reactTo.js"),
        require("./controllers/commands/createInvite.js"),
    ],
    events: [],
    extends: [],
    structures: [],
    permissions: ["MANAGE_ROLES"],
};