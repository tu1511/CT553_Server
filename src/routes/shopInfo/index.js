const { body, param, query } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication, permission } = require("../../middlewares/auth");
const {
    validate,
    existProvince,
    existDistrictOfProvince,
    existWardOfDistrict,
} = require("../../middlewares/validation");
const ShopInfoController = require("../../controllers/shopInfo");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(authentication);

router.get(
    "",
    permission(),
    validate,
    asyncHandler(ShopInfoController.getOne)
);

protectedRouter.post(
    "",
    permission(),
    body("name")
        .notEmpty()
        .withMessage("name is missing"),
    body("fullName").notEmpty().withMessage("fullName is missing"),
    body("email").notEmpty().withMessage("email is missing"),
    body("phone").notEmpty().withMessage("phone is missing"),
    body("businessCode").notEmpty().withMessage("businessCode is missing"),
    body("provinceId")
        .notEmpty()
        .withMessage("Province ID is missing")
        .custom(existProvince),
    body("districtId")
        .notEmpty()
        .withMessage("District ID is missing")
        .custom(existDistrictOfProvince),
    body("wardCode")
        .notEmpty()
        .withMessage("Ward code is missing")
        .custom(existWardOfDistrict),
    body("logoId").notEmpty().withMessage("logoId is missing"),
    validate,
    asyncHandler(ShopInfoController.create)
);

protectedRouter.put(
    "/:shopInfoId",
    permission(),
    param("shopInfoId")
        .notEmpty()
        .withMessage("shopInfo ID is missing"),
    body("provinceId")
        .notEmpty()
        .withMessage("Province ID is missing")
        .custom(existProvince),
    body("districtId")
        .notEmpty()
        .withMessage("District ID is missing")
        .custom(existDistrictOfProvince),
    body("wardCode")
        .notEmpty()
        .withMessage("Ward code is missing")
        .custom(existWardOfDistrict),
    validate,
    asyncHandler(ShopInfoController.update)
);

module.exports = { router, protectedRouter };
