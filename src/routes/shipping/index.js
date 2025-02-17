const { body } = require("express-validator");
const ShippingController = require("../../controllers/shipping");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate } = require("../../middlewares/validation");
const { authentication } = require("../../middlewares/auth");

const router = require("express").Router();

// router.use(authentication);

router.post(
  "/fee",
  body("toDistrictId")
    .notEmpty()
    .withMessage("The district ID of destination is missing"),
  body("toWardCode")
    .notEmpty()
    .withMessage("The ward code of destination is missing"),
  body("weightInGram")
    .notEmpty()
    .withMessage("The order's weight (in gram) is missing "),
  validate,
  asyncHandler(ShippingController.calculateShippingFee)
);

module.exports = router;
