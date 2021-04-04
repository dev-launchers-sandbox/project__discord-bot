# DevLaunchers Discord Bot

## What is this repository about?
This repository hosts the code for our *open-source, community-driven* Discord Bot.

## Setup
### Pre-requisites
- Make sure you have [Node.js](https://http://nodejs.org/) installed
- Create a [Discord](https://discord.com) account if you haven't already.
- Make sure you have a **Git Client**.

Once you have setup pre-requisites, follow these 6 simple steps in order:

1. Install all the packages for the bot with `npm install` in a terminal.
2. Create a new **Discord Bot Application**:
    - Visit [Discord's Developer Portal](https://discord.com/developers/applications/me) with a web-browser.
        - Click on the "New Application" button.
        - <img alt="How the 'New Application' button looks like" src="assets/create-application.png" width="30%" height="30%">

        - Enter "DevLaunchers Testing Bot" or whatever name you want, and then click "Create".
        - <img alt="The create application dialouge" src="assets/create-application-dialouge.png" width="20%" height="20%">

        - Navigate to the "Bot" tab in the sidebar.
        - <img alt="The bot sidebar tab" src="assets/sidebar-bot-tab.png" width="15%" height="15%">

        - Create a new Bot by clicking "Add Bot", and then confirm.
        - <img alt="The bot sidebar tab" src="assets/add-bot.png" width="30%" height="30%">

        - Copy your brand new bot's token, you'll need this for the next step.
        - **IMPORTANT: Do not share this token with anyone but official DevLaunchers Bot Contributors. They will have the  *"Bot Contributor"* role in our Discord Server.**
        - <img alt="The bot sidebar tab" src="assets/get-bot-token.png" width="30%" height="30%">

3. Fill out `.env.example` with the token you just copied.
    - 3.5 Rename `.env.example` to `.env`.
4. Add a new line to `.gitignore`:
```gitignore
node_modules
json.sqlite
# append
.env
```
5. In a terminal, run `npm run dev-start` for speedy changes (no metrics, make sure you know what you're doing), or `npm run start` for general testing.
6. Congratulations! You now have your very own instance of the DevLaunchers Discord Bot!
    - 6.1 **NOTE:** All of your changes are applied automatically. The bot is ready when it logs so in the terminal.

## Contributing
Please refer to [our contributors guide](CONTRIBUTING.md).

# Development environment

**YOU WILL NEED DOCKER-COMPOSE TO TEST YOUR CODE LOCALLY. Check here for installation instructions: https://docs.docker.com/compose/install/**

Development environment is defined in docker-compose.yaml. To integrate with the backend API
locally, clone the backend repo https://github.com/dev-launchers/platform__api into a sibling
repo.

The directory structure should look like
-
 | -plaform__api
 | -project__discord-bot


All the following commands assume you are running in the parent directory of this repo.

If you make any change to the code, this rebuilds the docker containers:
```
    $ docker-compose -f platform__api/docker-compose.yaml -f project__discord-bot/docker-compose.yaml build
```

After rebuilding, you'll have to rerun to start up the development environment with your new changes
```
    $ docker-compose -f platform__api/docker-compose.yaml -f project__discord-bot/docker-compose.yaml up
```

After you are done, run this to stop the containers:
```
    $ docker-compose -f platform__api/docker-compose.yaml -f project__discord-bot/docker-compose.yaml down
```
Certificate to test auth against the backend is in the `./dev` folder.

---

## Release

We are using semantic versioning to tag release. Follow https://github.com/semantic-release/semantic-release#commit-message-format
to format the commit messages.
Once you are ready to create a new release, create a PR to merge main branch to release branch.

## License
This repository is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

