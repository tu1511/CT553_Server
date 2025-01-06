const router = require("express").Router();
const { body } = require("express-validator");
const { validate, uniqueEmail } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const AccountController = require("../../controllers/account");

router.get("/:id", asyncHandler(AccountController.getOne));

module.exports = router;
