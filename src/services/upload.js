const prisma = require("../config/prismaClient");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
  // cloud_name: 'dphzvfcmy',
  // api_key: '296818592495358',
  // api_secret: '-5RUXR49Xuti9e-p79XeVbNok4Y'
});

class UploadService {
  static async uploadImage({ path, filename }) {
    console.log(path, filename);
    return await prisma.uploadedImage.create({
      data: {
        path,
        filename,
      },
    });
  }

  static async uploadImages(files) {
    return await Promise.all(
      files.map((file) =>
        prisma.uploadedImage.create({
          data: {
            path: file.path,
            filename: file.filename,
          },
        })
      )
    );
  }

  static async destroyImage(uploadedImageId) {
    const deletedImage = await prisma.uploadedImage.delete({
      where: {
        id: uploadedImageId,
      },
    });
    return await cloudinary.uploader.destroy(deletedImage.filename);
  }

  static destroyImageInDisk(uploadedImageFileName) {
    const fs = require("fs");
    fs.rmSync("uploads/" + uploadedImageFileName);
  }
}

module.exports = UploadService;
