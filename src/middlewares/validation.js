const { validationResult } = require("express-validator");
const { BadRequest } = require("../response/error");
const prisma = require("../config/prismaClient");
const GiaoHangNhanhService = require("../services/ghn");

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
  let countFoundCategories = 0;

  for (let categoryId of categoryIds) {
    if (!Number.parseInt(categoryId))
      throw new BadRequest("Category ID must be a number");

    const foundCategory = await prisma.category.findUnique({
      where: {
        id: +categoryId,
      },
    });

    if (foundCategory) countFoundCategories++;
  }

  if (countFoundCategories !== categoryIds.length) {
    throw new BadRequest("Some categories not found");
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

const existProvince = async (provinceId, { req }) => {
  if (!provinceId) return true;

  const provinces = await GiaoHangNhanhService.getProvinces();

  const foundProvince = provinces.find((province) => {
    return province.ProvinceID === +provinceId;
  });

  if (!foundProvince) throw new BadRequest("Province not found");

  req.body.provinceName = foundProvince.ProvinceName;
};

const existDistrictOfProvince = async (districtId, { req }) => {
  if (!districtId || !req.body.provinceId) return true;

  const districts = await GiaoHangNhanhService.getDistrictsByProvinceId(
    req.body.provinceId
  );

  const foundDistrict = districts.find(
    (district) => district.DistrictID === +districtId
  );

  if (!foundDistrict) throw new BadRequest("District not found");

  req.body.districtName = foundDistrict.DistrictName;
};

const existWardOfDistrict = async (wardCode, { req }) => {
  if (!wardCode || !req.body.districtId) return true;

  const wards = await GiaoHangNhanhService.getWardsByDistrictId(
    req.body.districtId
  );

  const foundWard = wards.find((ward) => {
    return ward.WardCode === wardCode;
  });

  if (!foundWard) throw new BadRequest("Ward not found");

  req.body.wardName = foundWard.WardName;
};

const existAddressOfAccount = async (addressId, { req }) => {
  if (!addressId) return true;

  const foundAddress = await prisma.address.findFirst({
    where: {
      id: +addressId,
      accountId: +req.account.id,
    },
  });

  if (!foundAddress) throw new BadRequest("Address not found");
};

const existOrder = async (orderId) => {
  if (!orderId) return true;

  const foundOrder = await prisma.order.findUnique({
    where: {
      id: +orderId,
    },
  });

  if (!foundOrder) throw new BadRequest("Order not found");
};

const existOrderOfAccount = async (orderId, { req }) => {
  if (!orderId) return true;

  const foundOrder = await prisma.order.findFirst({
    where: {
      id: +orderId,
      buyerId: +req.account.id,
    },
  });

  if (!foundOrder) throw new BadRequest("Order not found");
};

const existCoupon = async (couponId) => {
  if (!couponId) return true;

  const foundCoupon = await prisma.coupon.findUnique({
    where: {
      id: +couponId,
    },
  });

  if (!foundCoupon) throw new BadRequest("Coupon not found");
};

const existVariant = async (id) => {
  // console.log("validation id", id);
  // if (!Number.parseInt(id)) {
  //   console.log("validation not found");
  //   throw new BadRequest("Variant not found");
  // }
  // const foundVariant = await prisma.variant.findUnique({
  //   where: { id },
  // });
  // console.log("validation foundVariant", foundVariant);
  // if (!foundVariant) throw new BadRequest("Variant not found");
};

const existReview = async (reviewId) => {
  if (!reviewId) return true;
  if (!Number.parseInt(reviewId)) throw new BadRequest("Review not found");
  const foundReview = await prisma.review.findUnique({
    where: { id: +reviewId },
  });

  if (!foundReview) throw new BadRequest("Review not found");
};

const existReviewImage = async (reviewImageId, { req }) => {
  if (!reviewImageId) return true;
  if (!Number.parseInt(reviewImageId))
    throw new BadRequest("Review image not found");
  const foundReviewImage = await prisma.reviewImage.findUnique({
    where: {
      id: +reviewImageId,
    },
  });
  if (!foundReviewImage) throw new BadRequest("Review image not found");
};

const existReviewOfAccount = async (reviewId, { req }) => {
  if (!reviewId) return true;

  const foundReview = await prisma.review.findFirst({
    where: {
      id: +reviewId,
      accountId: +req.account.id,
    },
  });

  if (!foundReview) throw new BadRequest("Review not found");
};

const existBanner = async (bannerId) => {
  if (!bannerId) return true;
  if (!Number.parseInt(bannerId)) throw new BadRequest("Banner not found");
  const foundBanner = await prisma.banner.findUnique({
    where: { id: +bannerId },
  });
  if (!foundBanner) throw new BadRequest("Banner not found");
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
  existProvince,
  existDistrictOfProvince,
  existWardOfDistrict,
  existAddressOfAccount,
  existAccount,
  convertDateStringToISODate,
  existOrder,
  existOrderOfAccount,
  existCoupon,
  existVariant,
  existReview,
  existReviewImage,
  existReviewOfAccount,

  existBanner,
};
