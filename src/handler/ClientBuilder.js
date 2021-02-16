const { Client, Collection } = require("discord.js");

module.exports = class DevLaunchersBot extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.config = require("../config.json");
        this.recent = new Set();
    }

    startup() {
        const LevelManager = require('../extensions/Leveling/structures/LevelManager');
        let levelManager = new LevelManager();
        setInterval(() => {
            levelManager.resetQueueCycle();
        }, levelManager.config.interval);
    }
};