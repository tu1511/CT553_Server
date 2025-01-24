const { body, param, query } = require("express-validator");
const AddressController = require("../../controllers/address");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existProvince,
  existDistrictOfProvince,
  existWardOfDistrict,
  existAddressOfAccount,
} = require("../../middlewares/validation");

const router = require("express").Router();

router.get("/provinces", asyncHandler(AddressController.getProvinces));
router.get(
  "/districts",
  query("provinceId").notEmpty().withMessage("Province ID is missing"),
  validate,
  asyncHandler(AddressController.getDistricts)
);
router.get(
  "/wards",
  query("districtId").notEmpty().withMessage("District ID is missing"),
  validate,
  asyncHandler(AddressController.getWards)
);

router.use(authentication);

router.get("/current-account", asyncHandler(AddressController.getAll));

router.post(
  "/",
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
  body("contactName").notEmpty().withMessage("Contact name is missing"),
  body("contactPhone").notEmpty().withMessage("Contact phone is missing"),
  body("isDefault")
    .notEmpty()
    .withMessage("isDefault is missing")
    .isBoolean()
    .withMessage("isDefault should be true or false"),
  validate,
  asyncHandler(AddressController.create)
);

router.put(
  "/:addressId",
  param("addressId")
    .notEmpty()
    .withMessage("address ID is missing")
    .custom(existAddressOfAccount),
  body("provinceId").custom(existProvince),
  body("districtId").custom(existDistrictOfProvince),
  body("wardCode").custom(existWardOfDistrict),
  validate,
  asyncHandler(AddressController.update)
);

router.delete(
  "/:addressId",
  param("addressId")
    .notEmpty()
    .withMessage("address ID is missing")
    .custom(existAddressOfAccount),
  validate,
  asyncHandler(AddressController.delete)
);

module.exports = router;
