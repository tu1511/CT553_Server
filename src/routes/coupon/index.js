const { body, param } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { DISCOUNT_TYPES } = require("../../constant/discountType");
const { validate, existCoupon } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const CouponController = require("../../controllers/coupon");

const router = require("express").Router();

router.get("/valid", permission(), asyncHandler(CouponController.getValidCoupons));

router.use(authentication);

router.post(
  "",
  permission(),
  body("code")
    .notEmpty()
    .withMessage("Coupon code is missing"),
  // .isLength({ min: 8, max: 8 })
  // .withMessage("Coupon code must be 8 characters long"),
  body("discountType")
    .notEmpty()
    .withMessage("Discount type is missing")
    .isIn(DISCOUNT_TYPES)
    .withMessage("Invalid discount type"),
  body("discountValue").notEmpty().withMessage("Discount value is missing"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is missing")
    .isDate()
    .withMessage("Invalid date format"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is missing")
    .isDate()
    .withMessage("Invalid date format")
    .custom((value, { req }) => {
      if (new Date(req.body.startDate) >= new Date(value)) {
        throw new Error("End date must be greater than start date");
      }
      return true;
    }),
  body("quantity").notEmpty().withMessage("Coupon quantity is missing"),
  body("minimumPriceToUse")
    .notEmpty()
    .withMessage("Minimum price to use is missing"),
  validate,
  asyncHandler(CouponController.createCoupon)
);

router.put(
  "/:couponId",
  permission(),
  param("couponId").custom(existCoupon),
  validate,
  asyncHandler(CouponController.updateCoupon)
);

router.get("", permission(), asyncHandler(CouponController.getAllCoupons));

router.post(
  "/collect",
  body("couponCode").notEmpty().withMessage("Coupon code is missing"),
  validate,
  asyncHandler(CouponController.collectCoupon)
);

router.get("/collected", asyncHandler(CouponController.getCollectedCoupons));

router.get("/:code", permission(), asyncHandler(CouponController.getByCode));

router.delete("/:couponId", asyncHandler(CouponController.deleteCoupon));

module.exports = router;
