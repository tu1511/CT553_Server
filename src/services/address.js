const prisma = require("../config/prismaClient");

class AddressService {
  static async create(
    accountId,
    {
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
      contactName,
      contactPhone,
      isDefault,
      detailAddress = "",
    }
  ) {
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          accountId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        accountId,
        provinceId: +provinceId,
        districtId: +districtId,
        wardCode: wardCode,
        provinceName,
        districtName,
        wardName,
        contactName,
        contactPhone,
        isDefault,
        detailAddress,
      },
    });

    return newAddress;
  }

  static async getAddressesByAccountId(accountId) {
    return await prisma.address.findMany({
      where: {
        accountId,
      },
      orderBy: {
        isDefault: "desc",
      },
    });
  }

  static async updateById(addressId, accountId, updatedData) {

    const {
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
      contactName,
      contactPhone,
      isDefault,
      detailAddress,
    } = updatedData;

    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          accountId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }
    const updatedAddress = await prisma.address.update({
      where: {
        id: +addressId,
      },
      data: {
        provinceId: +provinceId,
        districtId: +districtId,
        wardCode: wardCode,
        provinceName,
        districtName,
        wardName,
        contactName,
        contactPhone,
        isDefault,
        detailAddress,
      },
    });

    return updatedAddress;
  }

  static async deleteById(addressId, accountId) {
    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    if (deletedAddress.isDefault) {
      const firstOfOtherAddresses = await prisma.address.findFirst({
        where: {
          accountId,
        },
      });

      if (firstOfOtherAddresses) {
        await prisma.address.update({
          where: { id: firstOfOtherAddresses.id },
          data: { isDefault: true },
        });
      }
    }

    return deletedAddress;
  }
}

module.exports = AddressService;
