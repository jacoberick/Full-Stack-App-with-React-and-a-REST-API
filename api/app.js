"use strict";

// load modules
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const sequelize = require("./models").sequelize;
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//testing db connection
sequelize
  .authenticate()
  .then(function(err) {
    console.log("Database connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database:", err);
  });

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// Enable all CORS Requests
app.use(cors());

// setup request body JSON parsing
app.use(express.json());

// setup for cookies
app.use(cookieParser());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// TODO setup your api routes here
app.use("/api", routes);

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!"
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
