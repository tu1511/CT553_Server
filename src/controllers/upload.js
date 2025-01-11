const { CreatedResponse, OKResponse } = require("../response/success");
const UploadService = require("../services/upload");

class UploadController {
  static async uploadImage(req, res) {
    console.log("uploadImage", req.file);
    new CreatedResponse({
      message: "Image was uploaded!",
      metadata: await UploadService.uploadImage({
        path: req.file.path,
        filename: req.file.filename,
      }),
    }).send(res);
  }

  static async uploadImages(req, res) {
    new CreatedResponse({
      message: "Image was uploaded!",
      metadata: await UploadService.uploadImages(req.files),
    }).send(res);
  }

  static async uploadImageToDisk(req, res) {
    new CreatedResponse({
      message: "Image was uploaded!",
      metadata: { path: req.file.path, filename: req.file.filename },
    }).send(res);
  }

  static async destroyImage(req, res) {
    new OKResponse({
      metadata: await UploadService.destroyImage(+req.params.uploadedImageId),
    }).send(res);
  }

  static destroyImageInDisk(req, res) {
    UploadService.destroyImageInDisk(req.params.uploadedImageFileName);
    new OKResponse({
      message: "Image was deleted!",
    }).send(res);
  }
}

module.exports = UploadController;
