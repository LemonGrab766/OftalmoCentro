const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/index.js");
const { client } = require("./controllers/wsp/whatsappClient.js");
require("dotenv").config();

const server = express();

const corsOptions = {
  origin: process.env.URL,
  credentials: true,
};

server.use(cors(corsOptions));

server.name = "OftalmoCentro";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

client.initialize();

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
