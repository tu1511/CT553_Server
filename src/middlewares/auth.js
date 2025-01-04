const { Forbidden, UnAuthorized } = require("../response/error");
const { asyncHandler } = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");

const permission = (permittedRoles) => (req, res, next) => {
  const accountRole = req.account.role;

  if (!accountRole || !permittedRoles.includes(accountRole))
    throw new Forbidden("You don't have permission to perform this action");

  next();
};

const authentication = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    req.account = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    throw new UnAuthorized("Invalid token");
  }
};

const getTokenFromRequest = (req) => {
  const requestBearer = req.headers.authorization;

  if (!requestBearer) throw new UnAuthorized("Authorization required");

  const token = requestBearer.split(" ")[1];

  if (!token) throw new UnAuthorized("Invalid token");

  return token;
};

module.exports = { authentication, permission };
