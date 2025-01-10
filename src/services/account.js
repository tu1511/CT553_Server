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

  static async updateInformation(accountId, updateData) {
    if (updateData.birthday) {
      updateData.birthday = new Date(updateData.birthday).toISOString();
    }
    const updateAccount = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });

    delete updateAccount.password;
    return updateAccount;
  }
}
module.exports = AccountService;
