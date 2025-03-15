const { CreatedResponse, OKResponse } = require("../response/success");
const PolicyService = require("../services/policy");

class PolicyController {
  static async getAll(req, res) {
    new OKResponse({
      metadata: await PolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await PolicyService.getCurrent(),
    }).send(res);
  }

  static async getOneBySlug(req, res) {
    new OKResponse({
      metadata: await PolicyService.getOneBySlug(req.params.slug),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await PolicyService.create(req.body),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await PolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await PolicyService.delete(+req.params.policyId),
    }).send(res);
  }
}

module.exports = PolicyController;
