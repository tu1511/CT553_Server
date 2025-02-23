const AccountController = require("../../controllers/account");
const router = require("express").Router();
const { body, param } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existAccount,
  convertDateStringToISODate,
} = require("../../middlewares/validation");

router.use(authentication);

router.post("", asyncHandler(AccountController.create));
router.get("", asyncHandler(AccountController.getAll));
// router.get("/logged-in-account", asyncHandler(AccountController.getOne));
router.get(
  "/logged-in-account",
  authentication,
  asyncHandler(AccountController.getLoggedInAccount)
);
// router.delete("/", asyncHandler(AccountController.deleteAll));
router.put(
  "",
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.updateInformation)
);
router.put(
  "/:accountId",
  body("email").isEmpty().withMessage("Can not update email"),
  body("birthday").custom(convertDateStringToISODate),
  validate,
  asyncHandler(AccountController.adminUpdateAccount)
);
router.put("/password", asyncHandler(AccountController.changePassword));

// lock account
router.put(
  "/toggleActive/:accountId",
  param("accountId").notEmpty().withMessage("account ID is missing"),
  validate,
  asyncHandler(AccountController.toggleActiveAccount)
);

module.exports = router;
