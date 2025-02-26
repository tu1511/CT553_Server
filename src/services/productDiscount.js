const prisma = require("../config/prismaClient");
const { BadRequest } = require("../response/error");

class ProductDiscountService {
  static async create({ productId, discountValue, startDate, endDate }) {
    console.log("productId", productId, typeof productId);
    console.log("discountValue", discountValue, typeof discountValue);
    console.log("startDate", startDate, typeof startDate);
    console.log("endDate", endDate, typeof endDate);

    const foundedProductDiscount = await prisma.productDiscount.findFirst({
      where: {
        productId: +productId,
        endDate: {
          gte: new Date(startDate).toISOString(),
        },
      },
    });

    if (foundedProductDiscount) {
      throw new BadRequest(
        "There is already a discount for this product in this period"
      );
    }
    return await prisma.productDiscount.create({
      data: {
        productId: +productId,
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate + "T23:59:59.000Z").toISOString(),
      },
    });
  }

  static async update({ productId, discountValue, startDate, endDate }) {
    const foundedProductDiscount = await prisma.productDiscount.findFirst({
      where: {
        productId: +productId,
      },
    });

    return await prisma.productDiscount.update({
      where: {
        id: foundedProductDiscount.id,
      },
      data: {
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate + "T23:59:59.000Z").toISOString(),
      },
    });
  }

  static async delete(id) {
    return await prisma.productDiscount.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

module.exports = ProductDiscountService;
