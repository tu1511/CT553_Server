const UploadController = require("../../controllers/upload");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const cloudUploader = require("../../middlewares/cloudUploader");

const router = require("express").Router();

router.post(
  "/image",
  cloudUploader.single("image"),
  asyncHandler(UploadController.uploadImage)
);

router.post(
  "/images",
  cloudUploader.array("images"),
  asyncHandler(UploadController.uploadImages)
);

router.delete("/:uploadedImageId", asyncHandler(UploadController.destroyImage));

module.exports = router;
