const { validationResult } = require("express-validator");
const { BadRequest } = require("../response/error");
const prisma = require("../config/prismaClient");

const uniqueEmail = async (email) => {
  if (!email) return false;
  const foundAccount = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  if (foundAccount) throw new BadRequest("This email has already been used!");
};

const existAccount = async (accountId) => {
  if (!accountId) return false;
  const foundAccount = await prisma.account.findUnique({
    where: {
      id: +accountId,
    },
  });

  if (!foundAccount) throw new BadRequest("Account not found");
};

const convertDateStringToISODate = (value) => {
  if (!value) return true;
  if (isNaN(Date.parse(value))) {
    throw new BadRequest("Invalid date format");
  }
  return true;
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequest("Invalid input", errors.errors));
  }
  next();
};

const existCategory = async (categoryId) => {
  if (!categoryId) return true;
  if (!Number.parseInt(categoryId))
    throw new BadRequest("Category ID must be a number");
  const foundCategory = await prisma.category.findUnique({
    where: {
      id: +categoryId,
    },
  });

  if (!foundCategory) throw new BadRequest("Category not found");
};

const existCategories = async (categoryIds) => {
  if (!categoryIds) return true;

  for (let categoryId of categoryIds) {
    if (!Number.parseInt(categoryId))
      throw new BadRequest("Category ID must be a number");

    const foundCategory = await prisma.category.findUnique({
      where: {
        id: +categoryId,
      },
    });
    if (foundCategories.length !== categoryIds.length) {
      throw new BadRequest("Some categories not found");
    }
  }
};

const existProduct = async (productId) => {
  if (!productId) return true;
  if (!Number.parseInt(productId)) throw new BadRequest("Product not found");
  const foundProduct = await prisma.product.findUnique({
    where: { id: +productId },
  });

  if (!foundProduct) throw new BadRequest("Product not found");
};

const existProductWithSlug = async (productSlug) => {
  if (!productSlug) return true;
  const foundProduct = await prisma.product.findUnique({
    where: { slug: productSlug },
  });

  if (!foundProduct) throw new BadRequest("Product not found");
};

const existProductImage = async (productImageId, { req }) => {
  if (!productImageId) return true;
  if (!Number.parseInt(productImageId))
    throw new BadRequest("Product image not found");
  const foundProductImage = await prisma.productImage.findUnique({
    where: {
      id: +productImageId,
    },
  });
  if (!foundProductImage) throw new BadRequest("Product image not found");
};

const existUploadedImage = async (uploadedImageId) => {
  if (!uploadedImageId) return true;
  if (!Number.parseInt(uploadedImageId))
    throw new BadRequest("Uploaded image not found");
  const foundImage = await prisma.uploadedImage.findUnique({
    where: { id: +uploadedImageId },
  });
  if (!foundImage) throw new BadRequest("Uploaded image not found");
};

const existProductCategory = async (productCategoryId, { req }) => {
  if (!productCategoryId) return true;
  if (!Number.parseInt(productCategoryId))
    throw new BadRequest("Product category not found");
  const foundProductCategory = await prisma.productCategory.findUnique({
    where: { id: +productCategoryId },
  });
  if (!foundProductCategory) throw new BadRequest("Product category not found");
};

module.exports = {
  validate,
  uniqueEmail,
  existAccount,
  convertDateStringToISODate,
  existCategory,
  existCategories,
  existProduct,
  existProductWithSlug,
  existProductImage,
  existUploadedImage,
  existProductCategory,
};
