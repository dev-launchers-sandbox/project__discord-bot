# DevLaunchers Discord Bot

## What is this repository about?

This repository hosts the code for our _open-source, community-driven_ Discord Bot.

## Setup

### Pre-requisites

- Make sure you have read the [Contributor's Guide](CONTRIBUTING.md)

Follow these steps to run the bot:
1. Open Git Bash and follow the steps below.
2. Clone this repository into a directory. Make sure you know how to get back to it.
```
   $ git clone git@github.com:dev-launchers-sandbox/project__discord-bot.git
```
3. Use cd (change directory) to move into the newly created repository and install the dependencies. This may take some time.
```
   $ cd project__discord-bot
   $ npm install
```
4. Use ```cd...``` to go back to the parent directory. Clone the dev-env repo there (This is the repository where we will be running the bot from).
```
   $ cd ..
   $ git clone git@github.com:dev-launchers/platform__dev-env.git
```
5. Move into the dev-env repository using cd, and install the dependencies. This may take some time.
 ```
   $ cd platform__dev-env
   $ npm install
```
6. Now that you are inside of the dev-env repository, and you have installed everything, you can run `tilt up` to run the discord bot! Tilt provides a great UI at http://localhost:10350. Check it out!
```
   $ tilt up
```
7. Once you are done running the bot, run `tilt down` to end all services.
```
   $ tilt down
```
