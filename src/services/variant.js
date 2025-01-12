const prisma = require("../config/prismaClient");

class VariantService {
  static async create(productId, { size, price, quantity }) {
    return await prisma.variant.create({
      data: {
        productId,
        size,
        price,
        quantity,
      },
    });
  }

  static async getByVariantIds(variantIds = []) {
    return await prisma.variant.findMany({
      where: {
        id: {
          in: variantIds.map((id) => +id),
        },
      },
      include: {
        color: {
          include: {
            productImage: {
              include: {
                image: true,
              },
            },
            thumbnailImage: true,
          },
        },
        size: true,
        product: {
          include: {
            productDiscount: {
              where: {
                startDate: {
                  lte: new Date().toISOString(),
                },
                endDate: {
                  gte: new Date().toISOString(),
                },
              },
            },
          },
        },
      },
    });
  }

  static async update({ id, size, price, quantity }) {
    return await prisma.variant.update({
      where: {
        id,
      },
      data: {
        size,
        price,
        quantity: +quantity,
      },
    });
  }

  static async delete(id) {
    return await prisma.variant.delete({
      where: {
        id
      },
    });
  }
}

module.exports = VariantService;
