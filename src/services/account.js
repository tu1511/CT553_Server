const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");

class AccountService {
  static async getOne(accountId) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        avatar: true,
      },
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
      include: {
        avatar: true,
      },
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
      include: {
        avatar: true,
      },
    });

    return updateAccount;
  }

  static async toggleActive(accountId) {
    const account = await prisma.account.findUnique({
      where: { id: +accountId },
      select: { active: true },
    });

    const updateAccount = await prisma.account.update({
      where: { id: +accountId },
      data: { active: !account.active },
    });

    return updateAccount;
  }
}
module.exports = AccountService;
