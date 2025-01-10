const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");

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

  static async changePassword(accountId, updateData) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    const { password } = updateData;
    const matchedPassword = await bcrypt.compare(password, account.password);
    if (matchedPassword) {
      throw new BadRequest("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateAccount = await prisma.account.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    });

    return updateAccount;
  }
}
module.exports = AccountService;
