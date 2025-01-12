const { param, body, query } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const {
  uploadRoles,
  uploadPaymentMethods,
  uploadPaymentStatuses,
  uploadOrderStatuses,
  createDiscountForProducts,
  uploadModules,
  uploadPermissions,
} = require("../../services/uploadData/basic");
const {
  uploadParentCategories,
  uploadChildrenCategories,
} = require("../../services/uploadData/categories");
const {
  deleteCategories,
  deleteImages,
  deleteProducts,
} = require("../../services/uploadData/delete");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const UploadTempDataController = require("../../controllers/uploadData");

const router = require("express").Router();

router.post("/basic", (req, res) => {
  // uploadRoles();
  // uploadPaymentMethods();
  // uploadPaymentStatuses();
  // uploadOrderStatuses();
  // createDiscountForProducts();
  // uploadModules();
  uploadPermissions();
  res.send("Basic data uploaded successfully");
});

router.post("/categories", (req, res) => {
  // uploadParentCategories();
  uploadChildrenCategories();
  res.send("Categories uploaded successfully");
});

router.delete("/categories", (req, res) => {
  deleteCategories();
  res.send("Categories deleted successfully");
});

router.delete("/uploads", (req, res) => {
  deleteImages();
  res.send("Uploaded images deleted successfully");
});

router.delete("/products", (req, res) => {
  deleteProducts();
  res.send("Products deleted successfully");
});

router.post(
  "/crawl",
  body("url").notEmpty().withMessage("URL is missing"),
  validate,
  asyncHandler(UploadTempDataController.crawl)
);

router.post("/crawlMany", asyncHandler(UploadTempDataController.crawlMany));

router.post(
  "/crawlCategory",
  asyncHandler(UploadTempDataController.crawlCategory)
);

module.exports = router;
