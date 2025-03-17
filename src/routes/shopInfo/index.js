const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validation");
const ShopInfoController = require("../../controllers/shopInfo");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();

router.get("", validate, asyncHandler(ShopInfoController.getOne));

router.use(authentication);

router.post(
  "",
  body("name").notEmpty().withMessage("name is missing"),
  body("email").notEmpty().withMessage("email is missing"),
  body("phone").notEmpty().withMessage("phone is missing"),
  body("logoId").notEmpty().withMessage("logoId is missing"),
  validate,
  asyncHandler(ShopInfoController.create)
);

router.put(
  "/:shopInfoId",
  param("shopInfoId").notEmpty().withMessage("shopInfo ID is missing"),
  validate,
  asyncHandler(ShopInfoController.update)
);

module.exports = router;
