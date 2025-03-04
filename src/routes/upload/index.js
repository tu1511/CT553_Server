const UploadController = require("../../controllers/upload");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const cloudUploader = require("../../middlewares/cloudUploader");
const diskUploader = require("../../middlewares/diskUploader");

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

router.post(
  "/image/disk",
  diskUploader.single("image"),
  asyncHandler(UploadController.uploadImageToDisk)
);

router.delete("/:uploadedImageId", asyncHandler(UploadController.destroyImage));
router.delete(
  "/disk/:uploadedImageFileName",
  UploadController.destroyImageInDisk
);

module.exports = router;
