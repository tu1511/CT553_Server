const prisma = require("../config/prismaClient");

class AccountService {
  static async getOne(accountId) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });
    return {
      ...account,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}
module.exports = AccountService;
