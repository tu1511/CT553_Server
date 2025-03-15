const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validation");
const PolicyController = require("../../controllers/policy");

const express = require("express");
const router = express.Router();

router.get("", validate, asyncHandler(PolicyController.getAll));

router.get("/current", asyncHandler(PolicyController.getCurrent));

router.get(
  "/slug/:slug",
  param("slug"),
  validate,
  asyncHandler(PolicyController.getOneBySlug)
);

router.use(authentication);

router.post(
  "",
  body("visible").notEmpty().withMessage("Visibility is missing"),
  body("content").notEmpty().withMessage("Content is missing"),
  validate,
  asyncHandler(PolicyController.create)
);

router.put(
  "/:policyId",
  param("policyId").notEmpty().withMessage("policy ID is missing"),
  validate,
  asyncHandler(PolicyController.update)
);

router.delete(
  "/:policyId",
  param("policyId").notEmpty().withMessage("Article ID is missing"),
  validate,
  asyncHandler(PolicyController.delete)
);

module.exports = router;
