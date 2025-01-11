const { CreatedResponse, OKResponse } = require("../response/success");
const AccountService = require("../services/account");

class AccountController {
  static async getLoggedInAccount(req, res) {
    new OKResponse({
      metadata: await AccountService.getOne(req.account.id),
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

  static async changePassword(req, res) {
    new OKResponse({
      message: "Change password successfully",
      metadata: await AccountService.changePassword(+req.account.id, req.body),
    }).send(res);
  }

  static async toggleActiveAccount(req, res) {
    new CreatedResponse({
      message: "Toggle active successfully",
      metadata: await AccountService.toggleActive(req.params.accountId),
    }).send(res);
  }
}

module.exports = AccountController;
