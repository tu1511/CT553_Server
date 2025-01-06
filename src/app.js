const express = require("express");
const bodyParser = require("body-parser");
const {
  handleNotFoundRoute,
  errorHandler,
} = require("./middlewares/errorHandler");
const cors = require("cors");
const logger = require("morgan");

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(logger("dev"));

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", require("./routes"));
app.use(handleNotFoundRoute);
app.use(errorHandler);

module.exports = app;
