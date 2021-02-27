# Install

Create .env file with the corresponding discord token.

.env must be in the root directory.
The key is DISCORD_TOKEN


# Development environment
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