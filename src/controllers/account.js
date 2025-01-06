const { CreatedResponse, OKResponse } = require("../response/success");
const AccountService = require("../services/account");

class AccountController {
  static async getOne(req, res) {
    new OKResponse({
      message: "Get account successfully",
      metadata: await AccountService.getOne(+req.params.id),
    }).send(res);
  }
}

module.exports = AccountController;
