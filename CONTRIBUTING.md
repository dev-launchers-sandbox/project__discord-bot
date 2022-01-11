# How to Contribute to the DevLaunchers Bot

## Requirements:
Before you start contributing, you're going to need a few things:
- **Code Editor:**
    - Either [Atom](https://atom.io/) or [Visual Studio Code](https://code.visualstudio.com/)
    - Why? These are code editors that are 100% guarenteed to support the extensions we use.
- **Communication:**
    - While it may be obvious, you're going to need a GitHub account.
    - You're also going to need a Discord account, so you can:
        - Communicate effectively with other contributors
        - Test the changes you've made to the bot
        - Receive help as you need it
    - Message `Guillermo#2969` to join the testing server.
- **Docker:**
    - [Windows](https://docs.docker.com/desktop/windows/install/) 
    - [Mac](https://docs.docker.com/desktop/mac/install/)
    - [Linux](https://docs.docker.com/engine/install/) 
- **Tilt:**
    - Follow the [instructions](https://docs.tilt.dev/install.html) to install tilt. We are not using Kubernetes, so you can skip the kubernetes installation.
- **Node.js**
    - Install the latest **recommended** version at https://nodejs.org/
- **Git**
    - This is essential for version control. We will also be using Git Bash to run the bot. https://git-scm.com/
- **Python**
    - Python is required to run Node.js. Download it at https://www.python.org/downloads/

# Standards

## Code Style
To prevent formatting wars and be consistent, here are the coding style guidelines we have made:
- Use 2 space indentation (2 space tabs are fine too)
- Remove **all** unused variables, and make sure you do before every commit
    - This helps make sure the code runs as smooth as possible, as JavaScripts garbage collector has to do **much** less work.
- Make sure to annotate your code with [JSDoc comments](https://jsdoc.app/about-getting-started.html#adding-documentation-comments-to-your-code)
    - This helps *all* developers understand what your code does
    - **BONUS:** Atom and VSCode both use JSDoc comments for their autocomplete and inline function argument shower thing (don't know the offical name of it)
- Use double quotes (`" "`) for strings
- Always use ES6's Template Literals for string interpolation, and **never** concatenate strings.
    - Example:
      ```js
      // Very Bad:
      console.log(user + " has " + xp + " xp.");

      // Good:
      console.log(`${user} has ${xp} xp.`);
      ```
- End statements and expressions with semicolons (`;`).
- Use camelCase when naming variables


## Plugins
- ### What are plugins?
    - Plugins are our simple code organization solution, and a crucial part of our bot's ecosystem.
    - The bot is matter, the molecules of the matter are the plugins, and the atoms of those molecules are commands and events.
- ### What is the structure of a plugin?
    - Glad you asked, here's the standard structure of a plugin:
    - ### plugin-name
        - **assets** _(files like images and JSON which represent discrete pieces of content needed to make this plugin work)_
        - **controllers**
           - **commands** _(files representing each chat command this plugin accepts from users)_
           - **events** _(files representing each event that may be triggered and handled by this plugin)_
        - **extends** _(files that extend existing Discord.js classes [TextChannel, Guild, etc], adding functionality and state needed for this plugin)_
        - **structures** _(new classes, or structures, created and used by this specific plugin)_
        - **utils** _(files with utility modules [functions, classes, etc] which don't fit within **structures**, but are needed fir this specific plugin to function. **Using classes and thinking in terms of Structures is usually preferred!**)_
        - **index.js** _(file that has all the information to load the plugin, every plugin **MUST** contain this file. [Example](https://github.com/dev-launchers-sandbox/project__discord-bot/blob/release/src/plugins/Thread/index.js)_
        

_Note: Not all plugins will need all of the folders shown above!_ 
## Commits, Branches, and Pull Requests
- Before starting anything, make sure you:
    - ```bash
      git checkout master
      git pull
      git checkout -b "branch-name"
      ```
    - This ensures that you are working on the newest copy of the bot.
- Make sure your commits are descriptive, and in the present tense (per convention)
- Create a new branch for each new feature you add.
- You can create a pull request (commonly referred to as "PR")by clicking a little notice when you visit the repository that includes "merge changes"
- When creating a PR:
    - List all the new packages you've installed, and the purpose of each package
    - Give a summary of all the changes you've made
    - Give a summary of all the commands you've added
    - Explain the purpose for any new structures you've created
    - An example (my first PR!) is at [#101](https://github.com/dev-launchers-sandbox/project__discord-bot/pull/101)
- During a PR:
    - You may be asked questions about what certain things do
    - You may be asked to refactor/change your code because:
        - It doesn't comply with the standards we've set forth
        - It would be wise to add a new feature
        - Or, something is missing or confusing
## Staging
All features must be tested using the staging bot, before being pushed into release. The staging bot runs on the staging brach. The staging bot is *always* running in the Testing Server!

## Release
We are using semantic versioning to tag releases. Follow the [Format Guide](https://github.com/semantic-release/semantic-release#commit-message-format) to format commit messages.
