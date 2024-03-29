const express = require("express");
const app = express();
const cors = require("cors");

const databaseHandler = require("./../src/plugins/.common/structures/DataHandling/DatabaseHandler.js");
const db = require("./models/index.js");

app.use(
  cors({
    credentials: true,
    origin: [
      "https://devlaunchers.com",
      "https://staging.devlaunchers.com",
      "https://api.devlaunchers.com",
      "https://api-staging.devlaunchers.com",
      "http://localhost:3000",
    ],
  })
);

app.get("/discord/users/:id/beans", (req, res) => {
  const devBeans = databaseHandler.bean.getUserDevBeans(req.params.id) || 0;
  const goldenBeans =
    databaseHandler.bean.getUserGoldenBeans(req.params.id) || 0;
  const beans = {
    devBeans: devBeans,
    goldenBeans: goldenBeans,
  };
  res.send(beans);
});

app.get("/discord/users/:id/dev-beans", (req, res) => {
  const devBeans = databaseHandler.bean.getUserDevBeans(req.params.id) || 0;
  res.send(devBeans.toString());
});

app.get("/discord/users/:id/golden-beans", (req, res) => {
  //prettier-ignore
  const goldenBeans = databaseHandler.bean.getUserGoldenBeans(req.params.id) || 0;
  res.send(goldenBeans.toString());
});

const port = process.env.API_PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));

db.sequelize
  .authenticate()
  .then(() => console.log("\n\nDATABASE!!!!!\n\n"))
  .catch((err) => console.error("\n\nERROR connecting to the database: ", err));
