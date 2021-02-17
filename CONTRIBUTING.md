# How to Contribute to the DevLaunchers Bot

## Requirements:

Before you start contributing, you're going to need a few things:

-   **Code Editor:**
    -   Either [Atom](https://atom.io/) or [Visual Studio Code](https://code.visualstudio.com/)
    -   Why? These are code editors that are 100% guarenteed to support the extensions we use.
-   **Communication:**
    -   While it may be obvious, you're going to need a GitHub account.
    -   You're also going to need a Discord account, so you can:
        -   Communicate effectively with other contributors
        -   Test the changes you've made to the bot
        -   Recieve help as you need it
    -   Message `pyxld_kris#2057` (his username changes from time to time, but he will have an orange colored role, and be at the top of the role hierachy when he's online)

# Standards

## Code Style

To prevent formatting wars and be consistent, here are the coding style guidelines we have made:

-   Use 4 space indentation (4 space tabs are fine too)
-   Remove **all** unused variables, and make sure you do before every commit
    -   This helps make sure the code runs as smooth as possible, as JavaScripts garbage collector has to do **much** less work.
-   ~~Make sure to annotate your code with [JSDoc comments](https://jsdoc.app/about-getting-started.html#adding-documentation-comments-to-your-code)~~
    -   ~~This helps _all_ developers understand what your code does~~
    -   ~~**BONUS:** Atom and VSCode both use JSDoc comments for their autocomplete and inline function argument shower thing (don't know the offical name of it)~~
-   Make sure to use descriptive variable names, and comments to explain when things are not clear.
    -   A novice at programming should be able to read your code in 1 or 2 passes.
-   Use double quotes (`" "`) for strings
-   Always use ES6's Template Literals for string interpolation, and **never** concatenate strings.

    -   Example:

        ```js
        // Very Bad:
        console.log(user + " has " + xp + " xp.");

        // Good:
        console.log(`${user} has ${xp} xp.`);
        ```

-   End statements and expressions with semicolons (`;`).
    -   Why? There are two reasons:
        -   JavaScripts **Automatic Semicolon Insertion (ASI)** spends time on automatically inserting semicolons, but it's not always perfect.
        -   There are a few common cases where ASI fails to correctly guess where to end statements.
            -   This causes very uninformative error messages, and can take **hours** to diagnose if you're not very experienced.
-   Use `module.exports = value` rather than `exports = value`
    -   Why? [Because `module.exports` has inconsistent behavior](https://stackoverflow.com/questions/16383795/difference-between-module-module.exports-and-module.exports-in-the-commonjs-module-system)

## Plugins

-   ### What are plugins?
    -   Plugins are our simple code organization solution, and a crucial part of our bot's ecosystem.
    -   The bot is matter, the molecules of the matter are the plugins, and the atoms of those molecules are commands and events.
-   ### What is the structure of a plugin?
    -   Glad you asked, here's the standard structure of a plugin:
    -   ### plugin-name
        -   **assets** _(files like images and JSON which represent discrete pieces of content needed to make this plugin work)_
        -   **controllers**
            -   **commands** _(files representing each chat command this plugin accepts from users)_
            -   **events** _(files representing each event that may be triggered and handled by this plugin)_
        -   **extends** _(files that extend existing Discord.js classes [TextChannel, Guild, etc], adding functionality and state needed for this plugin)_
        -   **structures** _(new classes, or structures, created and used by this specific plugin)_
        -   **utils** _(files with utility modules [functions, classes, etc] which don't fit within **structures**, but are needed fir this specific plugin to function. **Using classes and thinking in terms of Structures is usually preferred!**)_

## Commits, Branches, and Pull Requests

-   Before starting anything, make sure you:
    -   ```bash
        git checkout master
        git pull
        git checkout -b "branch-name"
        ```
    -   This ensures that you are working on the newest copy of the bot.
-   Make sure your commits are descriptive, and in the present tense (per convention)
-   Create a new branch for each new feature you add.
-   You can create a pull request (commonly referred to as "PR")by clicking a little notice when you visit the repository that includes "merge changes"
-   When creating a PR:
    -   List all the new packages you've installed, and the purpose of each package
    -   Give a summary of all the changes you've made
    -   Give a summary of all the commands you've added
    -   Explain the purpose for any new structures you've created
    -   An example (my first PR!) is at [#101](https://github.com/dev-launchers-sandbox/project__discord-bot/pull/101)
-   During a PR:
    -   You may be asked questions about what certain things do
    -   You may be asked to refactor/change your code because:
        -   It doesn't comply with the standards we've set forth
        -   It would be wise to add a new feature
        -   Or, something is missing or confusing
-   Git Commit Messages:
    -   We don't ask for anything really fancy, just generally follow these guidelines:
        -   Prefix your commit messages with:
            -   **feat:** The new feature you're adding to a particular application
            -   **fix:** A bug fix
            -   **style:** Feature and updates related to styling
            -   **refactor:** Refactoring a specific section of the codebase
            -   **test:** Everything related to testing
            -   **docs:** Everything related to documentation
            -   **chore:** Regular code maintenance.
            -   [You can also use emojis to represent commit types]
            -   [Source](https://www.freecodecamp.org/news/writing-good-commit-messages-a-practical-guide/)
        -   Write your message in the imperative tense, as per GitHub convention (i.e: "fix" rather than "fixed", "fixes")
        -   If this commit solves an issue, make sure you say so in the message.
