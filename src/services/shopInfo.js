const prisma = require("../config/prismaClient");

class ShopInfoService {
  static async getOne() {
    return await prisma.shopInfo.findFirst({
      orderBy: {
        id: "asc",
      },
      include: {
        logo: true,
      },
    });
  }

  static async create({
    name,
    email,
    phone,
    slogan,
    workingTime,
    detailAddress = "",
    logoId,
  }) {
    const newShopInfo = await prisma.shopInfo.create({
      data: {
        name,
        email,
        phone,
        slogan,
        workingTime,
        detailAddress,
        logoId: +logoId,
      },
    });
    return newShopInfo;
  }

  static async update(
    shopInfoId,
    { name, email, phone, slogan, workingTime, detailAddress = "", logoId }
  ) {
    const updatedShopInfo = await prisma.shopInfo.update({
      where: {
        id: +shopInfoId,
      },
      data: {
        name,
        email,
        phone,
        slogan,
        workingTime,
        detailAddress,
        logoId: +logoId,
      },
    });
    return updatedShopInfo;
  }
}

module.exports = ShopInfoService;
