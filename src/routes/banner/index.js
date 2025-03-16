const { param, body } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existBanner, validate } = require("../../middlewares/validation");
const { authentication } = require("../../middlewares/auth");
const BannerController = require("../../controllers/banner");

const express = require("express");
const router = express.Router();

router.get("", asyncHandler(BannerController.getAll));
router.get(
  "/getByBannerCategory/:bannerCategoryId",
  asyncHandler(BannerController.getBannerByBannerCategoryId)
);

router.use(authentication);

router.get("/admin", asyncHandler(BannerController.getAllForAdmin));

router.post(
  "",
  body("imageId").notEmpty().withMessage("ImageId is missing"),
  body("priority").notEmpty().withMessage("Priority is missing"),

  validate,
  asyncHandler(BannerController.create)
);

router.put(
  "/:id",
  param("id").custom(existBanner),
  validate,
  asyncHandler(BannerController.update)
);

router.delete(
  "/:id",
  param("id").custom(existBanner),
  validate,
  asyncHandler(BannerController.delete)
);

module.exports = router;
