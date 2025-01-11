const { param, body, query } = require("express-validator");
const ProductController = require("../../controllers/product");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  existProduct,
  existProductWithSlug,
  validate,
  existProductImage,
  existCategory,
  existUploadedImage,
  existProductCategory,
  existCategories,
} = require("../../middlewares/validation");
const { authentication } = require("../../middlewares/auth");
const cloudUploader = require("../../middlewares/cloudUploader");
const { PRODUCT_QUERY_TYPES } = require("../../constant/productType");
const { DISCOUNT_TYPES } = require("../../constant/discountType");

// const router = require("express").Router();

const express = require("express");
const router = express.Router();

router.use(authentication);

router.get(
  "",

  query("type")
    .notEmpty()
    .withMessage("Product query type is missing!")
    .isIn(PRODUCT_QUERY_TYPES)
    .withMessage("Unknown product query type"),
  query("limit").isNumeric().withMessage("Limit should be a number"),
  // query("page").isNumeric().withMessage("Page should be a number"),
  // query("filter").isIn(["price", "discount"]),
  // query("filterMinPrice")
  //   .isNumeric()
  //   .withMessage("Min price should be a number"),
  // query("filterMaxPrice")
  //   .isNumeric()
  //   .withMessage("Max price should be a number"),
  query("categoryIds.*")
    .isNumeric()
    .withMessage("CategoryIds should be an integer array"),
  validate,
  asyncHandler(ProductController.getAll)
);

router.get(
  "/getAllTextEmbeddings",
  asyncHandler(ProductController.getAllTextEmbeddings)
);
router.get(
  "/createTextEmbeddingsForAllProducts",
  asyncHandler(ProductController.createTextEmbeddingsForAllProducts)
);

router.get(
  "/createEmbeddingsForProduct/:id",
  asyncHandler(ProductController.createEmbeddingsForProduct)
);
router.get(
  "/getAllImageEmbeddings",
  asyncHandler(ProductController.getAllImageEmbeddings)
);
router.get(
  "/createImageEmbeddingsForAllProducts",
  asyncHandler(ProductController.createImageEmbeddingsForAllProducts)
);

router.get("/search", asyncHandler(ProductController.search));
router.get(
  "/search/image",
  query("imageUrl").notEmpty().withMessage("Image's url is missing"),
  validate,
  asyncHandler(ProductController.searchByImageUrl)
);

router.get(
  "/related/:id",
  asyncHandler(ProductController.getRelatedProductsBasedOnText)
);

router.get(
  "/recommend",
  authentication,
  asyncHandler(ProductController.getRecommendedProducts)
);

router.get(
  "/:id",
  param("id").custom(existProduct),
  validate,
  asyncHandler(ProductController.getOne)
);

router.get(
  "/slug/:slug",
  param("slug").custom(existProductWithSlug),
  validate,
  asyncHandler(ProductController.getOneBySlug)
);

router.get(
  "/slug/allDiscounts/:slug",

  param("slug").custom(existProductWithSlug),
  validate,
  asyncHandler(ProductController.getOneBySlugWithAllDiscounts)
);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("name").notEmpty().withMessage("Name is missing"),
  body("specification").notEmpty().withMessage("Specification is missing"),
  body("material").notEmpty().withMessage("Material is missing"),
  body("overview").notEmpty().withMessage("Overview is missing"),
  body("instruction").notEmpty().withMessage("Instruction is missing"),
  body("categoryIds")
    .isArray()
    .withMessage("CategoryIds should be an array")
    .custom(existCategories),
  body("thumbnailImageId").custom(existUploadedImage),
  body("viewImageId").custom(existUploadedImage),
  body("uploadedImageIds")
    .isArray()
    .withMessage("uploadedImageIds should be an array"),
  body("variants").isArray().withMessage("Variants should be an array"),
  validate,
  asyncHandler(ProductController.create)
);

router.put(
  "/:productId",

  param("productId").custom(existProduct),
  asyncHandler(ProductController.update),
  validate
);

// hide product
router.put(
  "/toggleHide/:productId",

  param("productId").notEmpty().withMessage("product ID is missing"),
  validate,
  asyncHandler(ProductController.toggleHide)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existProduct),
  validate,
  asyncHandler(ProductController.delete)
);

// image_product begin
router.post(
  "/:id/add-image",
  param("id").custom(existProduct),
  body("uploadedImageId")
    .notEmpty()
    .withMessage("uploadedImageId is missing")
    .custom(existUploadedImage),
  validate,
  asyncHandler(ProductController.addImage)
);

router.delete(
  "/delete-image/:productImageId",
  param("productId").custom(existProduct),
  param("productImageId").custom(existProductImage),
  validate,
  asyncHandler(ProductController.deleteImage)
);
// image_product end

// category_product begin
router.post(
  "/:id/add-category",
  param("id").custom(existProduct),
  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is missing")
    .custom(existCategory),
  validate,
  asyncHandler(ProductController.addCategory)
);

router.delete(
  "/:id/delete-category/:categoryId",
  param("id").custom(existProduct),
  param("categoryId").custom(existCategory),
  validate,
  asyncHandler(ProductController.deleteCategory)
);
// category_product end

router.post(
  "/:id/discount",
  param("id").custom(existProduct),
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
  validate,
  asyncHandler(ProductController.createDiscount)
);

router.put(
  "/:id/discount",
  param("id").custom(existProduct),
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
  validate,
  asyncHandler(ProductController.updateDiscount)
);

module.exports = router;
