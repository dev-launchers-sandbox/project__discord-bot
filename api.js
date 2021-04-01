const express = require("express");
const app = express();
const cors = require("cors");

const databaseHandler = require("./src/plugins/.common/structures/DataHandling/DatabaseHandler.js");

app.use(
  cors({
    credentials: true,
    origin: [
      "https://devlaunchers.com/",
      "https://staging.devlaunchers.com/",
      "http://localhost:3000",
    ],
  })
);

app.get("/users/:id/dev-beans", (req, res) => {
  const devBeans = databaseHandler.bean.getUserDevBeans(req.params.id) || 0;
  res.send(devBeans.toString());
});

app.get("/users/:id/golden-beans", (req, res) => {
  //prettier-ignore
  const goldenBeans = databaseHandler.bean.getUserGoldenBeans(req.params.id) || 0;
  res.send(goldenBeans.toString());
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
