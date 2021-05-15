FROM node:12
WORKDIR /usr/src/app

#Installs sequelize and pg dependencies
RUN npm install pg
RUN npm install sequelize
RUN npm install sequelize-cli

#copies files needed for migrations
COPY api/config/config.js /usr/src/app/api/config/config.js
COPY api/migrations /usr/src/app/api/migrations
COPY api/models /usr/src/app/api/models

#runs migrations
CMD ["npx", "sequelize-cli", "db:migrate"]
