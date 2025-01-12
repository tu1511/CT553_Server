const { body } = require("express-validator");
const PaymentController = require("../../controllers/payment");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  validate,
  existOrderOfAccount,
} = require("../../middlewares/validation");
const { authentication } = require("../../middlewares/auth");

const router = require("express").Router();

router.get("/vnpay_return", PaymentController.handleVNPayReturn);

router.get("/statuses", asyncHandler(PaymentController.getPaymentStatuses));

router.get("/methods", asyncHandler(PaymentController.getPaymentMethods));

// router.use(authentication);

router.post(
  "/create-payment-url",
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is missng"),
    // .custom(existOrderOfAccount),
  body("amount").notEmpty().withMessage("Amount to pay is missing"),
  validate,
  asyncHandler(PaymentController.createPaymentUrlToVNPay)
);

module.exports = router;
