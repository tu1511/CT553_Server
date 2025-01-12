const { CreatedResponse, OKResponse } = require("../response/success");
const VariantService = require("../services/variant");

class VariantController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await VariantService.create(+req.params.productId, req.body),
    }).send(res);
  }

  static async getByVariantIds(req, res) {
    new OKResponse({
      metadata: await VariantService.getByVariantIds(req.query.variantIds),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await VariantService.update(req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await VariantService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = VariantController;
