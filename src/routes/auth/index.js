const AuthController = require("../../controllers/auth");
const router = require("express").Router();
const { body } = require("express-validator");
const { validate, uniqueEmail } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

// router.use(authentication);

router.post(
  "/register",
  body("fullName")
    .notEmpty()
    .withMessage("Full name is missing!")
    .isLength({ min: 2 })
    .withMessage("Full name should have at least 2 characters!"),
  body("email").isEmail().withMessage("Invalid email!").custom(uniqueEmail),
  body("password")
    .notEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8 })
    .withMessage("Password should have at least 8 characters!"),
  body("phone").isMobilePhone().withMessage("Invalid phone number!"),
  // body("gender").isBoolean().withMessage("Invalid gender!"),
  // body("birthday").isBefore(new Date()),
  validate,
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  body("email", "Invalid email!").isEmail(),
  body("password").notEmpty().trim().withMessage("Password is missing!"),
  validate,
  asyncHandler(AuthController.login)
);
router.post("/loginWithGoogle", asyncHandler(AuthController.loginWithGoogle));

router.post(
  "/adminLogin",
  body("email", "Invalid email!").isEmail(),
  body("password").notEmpty().trim().withMessage("Password is missing!"),
  validate,
  asyncHandler(AuthController.adminLogin)
);

router.post(
  "/adminLoginWithGoogle",
  asyncHandler(AuthController.adminLoginWithGoogle)
);

module.exports = router;
