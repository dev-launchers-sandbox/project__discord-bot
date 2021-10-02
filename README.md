# DevLaunchers Discord Bot

## What is this repository about?

This repository hosts the code for our _open-source, community-driven_ [Discord Bot](https://discord.js.org/#/docs/main/stable/general/welcome).

## Setup

### Pre-requisites

- Make sure you have read the [Contributor's Guide](CONTRIBUTING.md)
- Make sure you are in the Testing Server. DM `Guillermo#2969` if not.

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
4. Go to the Testing Server and download the env file inside of the text channel `env-file`. Rename the file to .env and drag it into the root of the project. This file will contain sensitive data about the bot. Please do not share it. 

5. Use ```cd...``` to go back to the parent directory. Clone the dev-env repo there (This is the repository where we will be running the bot from).
```
   $ cd ..
   $ git clone git@github.com:dev-launchers/platform__dev-env.git
```
6. Move into the dev-env repository using cd, and install the dependencies. This may take some time.
 ```
   $ cd platform__dev-env
   $ npm install
```
7. Now that you are inside of the dev-env repository, **open the Docker App**, and run `tilt up` to run the discord bot! Tilt provides a great UI at http://localhost:10350. Check it out! If for any reason the bot does not start up, let us know in the Discord Server!
```
   $ tilt up bot
```
8. Once you are done running the bot, run `tilt down` to end all services.
```
   $ tilt down
```
