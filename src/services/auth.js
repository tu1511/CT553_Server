const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");
const { generatePairTokens } = require("../utils/generateToken");
const { ADMIN, EMPLOYEE, getRole } = require("../constant/roles");
// const { changeImageUrlToFile } = require("../utils/index");

class AuthService {
  static async register({
    fullName,
    email,
    password,
    phone,
    gender,
    birthday,
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
      },
    });

    console.log(newAccount);

    return newAccount;
  }

  static async login({ email, password }) {
    const account = await prisma.account.findUnique({
      where: { email },
      // include: {
      //   role: {
      //     select: { role: true },
      //   },
      // },
    });

    if (!account) throw new BadRequest("Invalid credentials");

    const matchedPassword = await bcrypt.compare(password, account.password);

    if (!matchedPassword) throw new BadRequest("Invalid credentials");

    // check if account is blocked
    if (!account.active) throw new BadRequest("Account is blocked");

    return generateToken(account);
  }
}

function generateToken(account) {
  const tokens = generatePairTokens({
    id: account.id,
    // role: getRole(account.roleId),
  });
  return {
    account: {
      ...account,
      password: undefined,
      // role: account.role.role,
    },
    tokens,
  };
}

module.exports = AuthService;
