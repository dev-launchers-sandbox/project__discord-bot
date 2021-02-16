module.exports = class Logger {
    constructor() {
        // These are ANSI escape codes, and are standardized.
        this.RESET = "\x1b[0m";
        this.COLORS = {
            RED: "\x1b[31m",
            BLUE: "\x1b[34m",
        }
        this.STYLES = {
            BOLD_ON: "\x1b[1m",
            BOLD_OFF: "\x1b[22m",
        }
    }

    /**
     * Logs a neat message to the console.
     * @param {String} fileName The name of the file **`log()`** is being run in
     * @param {String} className The name of the class **`log()`** is being run in
     * @param {String} methodName The name of the method **`log()`** is being run in
     * @param {String} message The message to log.
     */
    log(fileName, className, methodName, message) {
        console.log(`${this.STYLES.BOLD_ON}${fileName}.${className}.${methodName}() ${this.COLORS.BLUE}LOG:${this.RESET} ${message}`);
    }
}