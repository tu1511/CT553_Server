const router = require("express").Router();
const { body, param } = require("express-validator");
const {
  validate,
  uniqueEmail,
  convertDateStringToISODate,
} = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const AccountController = require("../../controllers/account");

router.use(authentication);
// router.get("/:id", asyncHandler(AccountController.getOne));
router.get(
  "/logged-in-account",
  authentication,
  asyncHandler(AccountController.getLoggedInAccount)
);
router.put(
  "",
  body("email").isEmpty().withMessage("Email cannot be updated"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);

router.put("/password", asyncHandler(AccountController.changePassword));

router.put(
  "/toggle-active/:accountId",
  param("accountId").notEmpty().withMessage("Account ID is required"),
  validate,
  asyncHandler(AccountController.toggleActiveAccount)
);

module.exports = router;
