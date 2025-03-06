const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const {
    validate,
} = require("../../middlewares/validation");
const PaymentPolicyController = require("../../controllers/paymentPolicy");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

protectedRouter.get(
    "",
    permission(),
    validate,
    asyncHandler(PaymentPolicyController.getAll)
);

router.get("/current", permission(), asyncHandler(PaymentPolicyController.getCurrent));

protectedRouter.get(
    "/:policyId",
    permission(),
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.getById)
);

protectedRouter.post(
    "",
    permission(),
    body("visible").notEmpty().withMessage("Visibility is missing"),
    body("content").notEmpty().withMessage("Content is missing"),
    validate,
    asyncHandler(PaymentPolicyController.create)
);

protectedRouter.put(
    "/:policyId",
    permission(),
    param("policyId")
        .notEmpty()
        .withMessage("policy ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.update)
);

// hide policy
protectedRouter.put(
    "/toggleHide/:policyId",
    permission(),
    param("policyId")
        .notEmpty()
        .withMessage("policyId ID is missing"),
    validate,
    asyncHandler(PaymentPolicyController.toggleHide)
);

module.exports = { router, protectedRouter };
