const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");

class AccountService {
  static async create({
    fullName,
    email,
    password,
    phone,
    gender,
    birthday,
    avatarId,
    roleId = 3,
    active = true,
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await prisma.account.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        birthday,
        avatarId: +avatarId,
        roleId: +roleId,
        active,
      },
    });
    return newAccount;
  }

  static async getAll({
    // customerSearch,
    // active,
    // role,
    // gender,
    // sortBy,
    page,
    limit,
  }) {
    let query = {
      include: {
        avatar: true,
      },
      // take: limit,
      // orderBy: {
      //   createdAt: "desc",
      // },
    };
    // search
    // if (customerSearch) {
    //   // if customerSearch is a number, search by id
    //   if (!query.where) Object.assign(query, { where: {} });
    //   if (!isNaN(customerSearch)) {
    //     query.where = {
    //       id: {
    //         equals: +customerSearch,
    //       },
    //     };
    //   } else {
    //     query.where = {
    //       fullName: {
    //         contains: customerSearch,
    //         mode: "insensitive",
    //       },
    //     };
    //   }
    // }

    // // filter
    // if (active !== "all") {
    //   if (!query.where) Object.assign(query, { where: {} });
    //   query.where.active = active === "true";
    // }

    // if (role !== "all") {
    //   if (!query.where) Object.assign(query, { where: {} });
    //   query.where.roleId = +role;
    // }

    // if (gender !== "all") {
    //   if (!query.where) Object.assign(query, { where: {} });
    //   query.where.gender = gender === "true";
    // }

    // // sort
    // if (sortBy?.field === "createdAt") {
    //   query.orderBy = {
    //     createdAt: sortBy.direction,
    //   };
    // } else if (sortBy?.field === "fullName") {
    //   query.orderBy = {
    //     fullName: sortBy.direction,
    //   };
    // }

    // pagination
    const count = await prisma.account.count({
      where: query.where,
    });

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);
    let accounts = await prisma.account.findMany({ ...query, skip: offset });

    return {
      accounts,
      pagination: {
        totalAccounts: count,
        totalPages,
      },
    };
  }

  static async updateInformation(accountId, updatedData) {
    if (updatedData.birthday) {
      updatedData.birthday = new Date(updatedData.birthday).toISOString();
    }
    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: updatedData,
      include: {
        avatar: true,
      },
    });

    delete updatedAccount.password;

    return updatedAccount;
  }

  static async changePassword(accountId, updatedData) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    const { password } = updatedData;
    const matchedPassword = await bcrypt.compare(password, account.password);
    if (matchedPassword)
      throw new BadRequest("Can not change into previous password");

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: { password: hashedPassword },
      include: {
        avatar: true,
      },
    });
    return updatedAccount;
  }

  static async getOne(accountId) {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
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

  static async deleteAll() {
    const deletedAccount = await prisma.account.deleteMany();
    return deletedAccount;
  }

  static async toggleActive(accountId) {
    const account = await prisma.account.findUnique({
      where: {
        id: +accountId,
      },
      select: {
        active: true,
      },
    });

    return prisma.account.update({
      where: {
        id: +accountId,
      },
      data: {
        active: !account.active,
      },
    });
  }
}

module.exports = AccountService;
