var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

const db = require("./db");
const cache = require("./cache");

var tasksApiRouter = require("./routes/api/tasks");

var app = express();

// Share pg Client Pool accross requests
app.locals.db = db;

// Share cache connection accross requests
app.locals.cache = cache;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/tasks", tasksApiRouter);

module.exports = app;
