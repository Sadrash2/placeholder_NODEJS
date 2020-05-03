const cors = require("cors");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const postsRoutes = require("./api/routes/posts");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // cors enable

// Routes which should handle requests
app.use("/posts", postsRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
