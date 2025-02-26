const { param, body, query } = require("express-validator");
const VariantController = require("../../controllers/variant");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { validate, existProduct } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router({ mergeParams: true });

router.use(authentication);

router.post(
  "/:id",
  param("id").custom(existProduct),
  body("size").notEmpty().withMessage("Size is missing"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
  body("price").isFloat().withMessage("Price must be a float"),
  body("startDate")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Invalid date format"),
  body("endDate")
    // .notEmpty()
    // .withMessage("End date is missing")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Invalid date format")
    .custom((value, { req }) => {
      if (new Date(req.body.startDate) >= new Date(value)) {
        throw new Error("End date must be greater than start date");
      }
      return true;
    }),
  validate,
  asyncHandler(VariantController.create)
);

router.put(
  "/:id",
  param("productId").custom(existProduct),
  validate,
  asyncHandler(VariantController.update)
);

router.delete(
  "/:id",
  param("productId").custom(existProduct),
  // param("id").custom(existVariant),
  validate,
  asyncHandler(VariantController.delete)
);

module.exports = router;
