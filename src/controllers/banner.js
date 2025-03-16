const { CreatedResponse, OKResponse } = require("../response/success");
const BannerService = require("../services/banner");

class BannerController {
  static async getAll(req, res) {
    new OKResponse({
      metadata: await BannerService.getAll(),
    }).send(res);
  }

  static async getBannerByBannerCategoryId(req, res) {
    new OKResponse({
      metadata: await BannerService.getBannerByBannerCategoryId(
        req.params.bannerCategoryId
      ),
    }).send(res);
  }

  static async getAllForAdmin(req, res) {
    new OKResponse({
      metadata: await BannerService.getAllForAdmin({
        bannerSearch: req.query.bannerSearch,
        visible: req.query.visible,
        // limit: +req.query.limit,
        // page: +req.query.page || 1,
        // sortBy: req.query.sortBy,
      }),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await BannerService.create(req.body),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await BannerService.update(req.params.id, req.body),
    }).send(res);
  }
}

module.exports = BannerController;
