const { BadRequest } = require("../response/error");
const { CreatedResponse, OKResponse } = require("../response/success");
const CategoryService = require("../services/category");

class CategoryController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await CategoryService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new CreatedResponse({
      metadata: await CategoryService.getAll(),
    }).send(res);
  }

  static async getAllForAdmin(req, res) {
    new CreatedResponse({
      metadata: await CategoryService.getAllForAdmin({
        categorySearch: req.query.categorySearch,
        isRootCategory: req.query.isRootCategory,
        limit: +req.query.limit,
        page: +req.query.page || 1,
        sortBy: req.query.sortBy,
      }),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await CategoryService.getOne(+req.params.categoryId),
    }).send(res);
  }

  static async getOneBySlug(req, res) {
    new OKResponse({
      metadata: await CategoryService.getOneBySlug(req.params.categorySlug),
    }).send(res);
  }

  static async getRootParent(req, res) {
    new OKResponse({
      metadata: await CategoryService.getRootParent(+req.params.categoryId),
    }).send(res);
  }

  static async getChildren(req, res) {
    new OKResponse({
      // metadata: await CategoryService.getCategoriesRecursivelyFromParent(+req.params.categoryId),
      metadata: await CategoryService.getChildren(+req.params.categoryId),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await CategoryService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await CategoryService.delete(+req.params.id),
    }).send(res);
  }

  // static async getBreadcrumb(req, res) {
  //   console.log("req", req.query);
  //   const subCategoryId = +req.query.fromCategoryId;
  //   const productSlug = req.query.fromProductSlug;

  //   console.log(subCategoryId, productSlug);
  //   if (!subCategoryId && !productSlug) {
  //     throw new BadRequest("Invalid Request");
  //   }

  //   const breadcrumb = productSlug
  //     ? await CategoryService.getBreadcrumbFromProduct(productSlug)
  //     : await CategoryService.getBreadcrumbFromSubCategory(subCategoryId);

  //   new OKResponse({
  //     metadata: breadcrumb,
  //   }).send(res);
  // }
  static async getBreadcrumb(req, res) {
    const subCategoryId = +req.query.fromCategoryId; // Ép kiểu về số
    // const productSlug = req.query.fromProductSlug;

    // if (!subCategoryId && !productSlug) {
    //   throw new BadRequest("Invalid Request");
    // }

    if (!subCategoryId) {
      throw new BadRequest("Invalid Request");
    }

    // console.log("Controller productSlug", productSlug);
    // const res1 = await CategoryService.getBreadcrumbFromProduct(productSlug);
    // console.log("res1", res1);

    console.log("Controller subCategoryId", subCategoryId);
    const res2 = await CategoryService.getBreadcrumbFromSubCategory(
      +req.query.fromCategoryId
    );
    console.log("res2", res2);

    // const breadcrumb = productSlug ? res1 : res2;
    const breadcrumb = res2;

    new OKResponse({
      metadata: breadcrumb,
    }).send(res);
  }
}

module.exports = CategoryController;
