const { CreatedResponse, OKResponse } = require("../response/success");
const PaymentPolicyService = require("../services/paymentPolicy");

class PaymentPolicyController {

  static async getAll(req, res) {
    new OKResponse({
      metadata: await PaymentPolicyService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await PaymentPolicyService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await PaymentPolicyService.getById(req.params.policyId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await PaymentPolicyService.create(req.body.content, req.body.visible),
    }).send(res);
  }

  static async update(req, res) {
    new CreatedResponse({
      metadata: await PaymentPolicyService.update(req.params.policyId, req.body),
    }).send(res);
  }

  // update

  static async toggleHide(req, res) {
    new CreatedResponse({
      metadata: await PaymentPolicyService.toggleHide(req.params.policyId),
    }).send(res);
  } re
}

module.exports = PaymentPolicyController;
