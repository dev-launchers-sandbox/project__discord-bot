const Discord = require("discord.js");
const express = require("express");
const devlaunchersBot = require("./handler/ClientBuilder.js");
const client = new devlaunchersBot({ partials: ["MESSAGE", "REACTION"] });
const promClient = require("prom-client");

const metrics = registerMetrics();
startMetricsServer(metrics);

require("./handler/module.js")(client);
require("./handler/Event.js")(client);

client.package = require("../package.json");

//require("dotenv").config();

client.on("warn", console.warn);
client.on("error", console.error);

client.login("NzE3MTI0NTA4MTg3NjIzNTIw.XtVwPg.NoWIQ1yTG5zOdPNhVqp5-FuYhzQ");

function registerMetrics() {
  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  const Registry = promClient.Registry;
  const register = new Registry();
  collectDefaultMetrics({ register });
  const events = new promClient.Counter({
    name: "events_count",
    help: "Count of discrod events",
    labelNames: ["event"],
  });
  register.registerMetric(events);
  return {
    register: register,
    events: events,
  };
}

function startMetricsServer(metrics) {
  const server = express();
  server.get("/metrics", (req, res) => {
    res.set("Content-Type", metrics.register.contentType);
    res.end(metrics.register.metrics());
  });

  const port = process.env.PORT;
  console.log(
    `Metrics server listening to ${port}, metrics exposed on /metrics endpoint`
  );
  server.listen(port);
}

function sendEvent(metric) {
  metrics.events.inc({ event: metric });
}

exports.sendEvent = sendEvent;
