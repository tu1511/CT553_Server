const router = require("express").Router();
const { body } = require("express-validator");
const {
  validate,
  uniqueEmail,
  convertDateStringToISODate,
} = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const AccountController = require("../../controllers/account");

router.use(authentication);
router.get("/:id", asyncHandler(AccountController.getOne));
router.put(
  "",
  body("email").isEmpty().withMessage("Email cannot be updated"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);

module.exports = router;
