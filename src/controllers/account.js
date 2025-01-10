const { CreatedResponse, OKResponse } = require("../response/success");
const AccountService = require("../services/account");

class AccountController {
  static async getOne(req, res) {
    new OKResponse({
      message: "Get account successfully",
      metadata: await AccountService.getOne(req.params.id),
    }).send(res);
  }

  static async updateInformation(req, res) {
    delete req.body.email;
    delete req.body.password;
    new OKResponse({
      message: "Update account successfully",
      metadata: await AccountService.updateInformation(
        +req.account.id,
        req.body
      ),
    }).send(res);
  }
}

module.exports = AccountController;
