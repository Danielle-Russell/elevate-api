require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routers/userRouter");
const workoutRouter = require("./routers/workoutRouter");
const prefRouter = require("./routers/prefRouter");

const app = express();

const { NODE_ENV } = require("./config");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));

app.use(helmet());

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use("/api/users", userRouter);

app.use("/api/workouts", workoutRouter);

app.use("/api/preferences", prefRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };

    res.status(500).json(response);
  }
});

module.exports = app;
