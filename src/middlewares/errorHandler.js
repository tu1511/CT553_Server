const { NotFound } = require("../response/error");

const handleNotFoundRoute = (req, res, next) => {
  throw new NotFound("Route not found!");
};

const errorHandler = (error, req, res, next) => {
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  const errors = error.errors;
  res.status(statusCode).json({
    message,
    statusCode,
    errors,
  });
};

module.exports = { errorHandler, handleNotFoundRoute };
