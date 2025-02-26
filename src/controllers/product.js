const prisma = require("../config/prismaClient");
const { PRODUCT_TRENDING } = require("../constant/productType");
const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");
const ProductDiscountService = require("../services/productDiscount");

class ProductController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ProductService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ProductService.getAll({
        productSearch: req.query.productSearch, // of admin
        type: req.query.type,
        categoryIds: req.query.categoryIds,
        limit: +req.query.limit,
        productIds: req.query.productIds,
        page: +req.query.page || 1,
        discount: req.query.discount,
        visible: req.query.visible,
        filterMinPrice: +req.query.filterMinPrice,
        filterMaxPrice: +req.query.filterMaxPrice,
        sortBy: req.query.sortBy,
      }),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await ProductService.getOne(+req.params.id),
    }).send(res);
  }

  static async getOneBySlug(req, res) {
    new OKResponse({
      metadata: await ProductService.getOneBySlug(req.params.slug),
    }).send(res);
  }

  static async getOneBySlugWithAllDiscounts(req, res) {
    new OKResponse({
      metadata: await ProductService.getOneBySlugWithAllDiscounts(
        req.params.slug
      ),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ProductService.update(+req.params.productId, req.body),
    }).send(res);
  }

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await ProductService.toggleHide(req.params.productId),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await ProductService.delete(+req.params.id),
    }).send(res);
  }

  static async addImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.addImage(+req.params.id, req.body),
    }).send(res);
  }

  static async deleteImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.deleteImage(+req.params.productImageId),
    }).send(res);
  }

  static async addCategory(req, res) {
    new CreatedResponse({
      metadata: await ProductService.addCategory(+req.params.id, req.body),
    }).send(res);
  }

  static async deleteCategory(req, res) {
    new CreatedResponse({
      metadata: await ProductService.deleteCategory(
        +req.params.id,
        +req.params.categoryId
      ),
      // metadata: {},
    }).send(res);
  }

  static async createDiscount(req, res) {
    new CreatedResponse({
      message: "Product discount created",
      metadata: await ProductDiscountService.create({
        ...req.body,
        productId: +req.params.id,
      }),
    }).send(res);
  }

  static async updateDiscount(req, res) {
    new CreatedResponse({
      message: "Product discount updated",
      metadata: await ProductDiscountService.update({
        ...req.body,
        productId: +req.params.id,
      }),
    }).send(res);
  }

  static async deleteDiscount(req, res) {
    new CreatedResponse({
      message: "Product discount deleted",
      metadata: await ProductDiscountService.delete(+req.params.id),
    }).send(res);
  }

  static async getAllTextEmbeddings(req, res) {
    new OKResponse({
      metadata: await ProductService.getAllTextEmbeddings(),
    }).send(res);
  }

  static async createTextEmbeddingsForAllProducts(req, res) {
    new OKResponse({
      metadata: await ProductService.createTextEmbeddingsForAllProducts(),
    }).send(res);
  }

  static async getAllImageEmbeddings(req, res) {
    new OKResponse({
      metadata: await ProductService.getAllImageEmbeddings(),
    }).send(res);
  }

  static async createImageEmbeddingsForAllProducts(req, res) {
    new OKResponse({
      metadata: await ProductService.createImageEmbeddingsForAllProducts(),
    }).send(res);
  }

  static async createEmbeddingsForProduct(req, res) {
    new OKResponse({
      metadata: await ProductService.createEmbeddingsForProduct(+req.params.id),
    }).send(res);
  }

  static async search(req, res) {
    const query = req.query.s;

    new OKResponse({
      metadata: await ProductService.search(query),
    }).send(res);
  }

  static async getRelatedProductsBasedOnText(req, res) {
    const productId = +req.params.id;

    new OKResponse({
      metadata: await ProductService.getRelatedProductsBasedOnText(productId),
    }).send(res);
  }

  static async getRecommendedProducts(req, res) {
    const accountId = +req.account.id;

    new OKResponse({
      metadata: await ProductService.getRecommendProducts(accountId),
    }).send(res);
  }

  static async searchByImageUrl(req, res) {
    const imageUrl = req.query.imageUrl;
    let uploadedImagePath = "";
    if (imageUrl.startsWith(process.env.BACKEND_URL)) {
      uploadedImagePath = imageUrl.substring(
        process.env.BACKEND_URL.length + 1
      );
    }
    new OKResponse({
      metadata: await ProductService.imageSearch(imageUrl, uploadedImagePath),
    }).send(res);
  }
}

module.exports = ProductController;
