const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class CommandHandler {
    constructor(commandName, message, args) {
        this.commandName = commandName;
        this.guild = message.guild;
        this.channel = message.channel;
        this.message = message;
        this.user = message.member;
        this.args = args;
    }

    getNumArgs() {
        return this.args.length;
    }

    validateCategory(permissions) {
        if (permissions.length > 0) {
            for (const permission of permissions) {
                if (!this.user.permissions.has(permission)) {
                    return false;
                }
            }
        }
        return true;
    }

    validateCommand(requirements) {
        let prefix = "."; // TODO: fetch prefix from database?

        // Check permissions
        if (requirements.permissions)
            for (const permission of requirements.permissions) {
                if (!this.user.permissions.has(permission)) {
                    this.error({
                        title: "Missing Permissions!",
                        description: `You are missing: **${permission}**`,
                        footer: `For further help, type ${prefix}help ${this.name}`,
                    });
                    return false;
                }
            }

        // Check number of arguments
        if (requirements.arguments)
            if (this.args.length < requirements.arguments.length) {
                this.error({
                    title: "Missing Parameters!",
                    description: `Required parameters: **${requirements.arguments.join(
            " "
          )}**`,
                    footer: `For further help, type ${prefix}help ${this.name}`,
                });
                return false;
            }

        return true;
    }

    error(args) {
        args.title = args.title ? args.title : "Error!";
        args.description = args.description ?
            args.description :
            `There was an unexpected error while running the ${this.commandName} command`;
        args.color = "RED";

        this.channel.sendEmbed({
            author: "",
            title: args.title,
            description: args.description,
            footer: "",
            color: "RED",
            timestamp: "",
        });
    }

    deleteCommand(miliseconds) {
        if (!miliseconds) miliseconds = 3000;
        setTimeout(() => {
            this.message.delete();
        }, miliseconds);
    }
};