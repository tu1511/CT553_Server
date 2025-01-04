const express = require("express");
const bodyParser = require('body-parser');
const {
  handleNotFoundRoute,
  errorHandler,
} = require("./middlewares/errorHandler");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes"));
app.use(handleNotFoundRoute);
app.use(errorHandler);

module.exports = app;
