const prisma = require("../config/prismaClient");

class VariantService {
  static async create({
    productId,
    size,
    price,
    quantity,
    startDate,
    endDate,
  }) {
    // Tạo variant mới
    const newVariant = await prisma.variant.create({
      data: {
        productId: +productId,
        size,
        quantity,
      },
    });

    // Tạo bản ghi History_Price cho variant vừa tạo
    await prisma.history_Price.create({
      data: {
        variantId: newVariant.id,
        price: Number(price),
        startDate: startDate ? new Date(startDate) : new Date(), // Nếu không có startDate thì dùng thời gian hiện tại
        endDate: endDate ? new Date(endDate) : null, // Nếu không có endDate thì để null
      },
    });

    return newVariant;
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
    return await prisma.$transaction(async (tx) => {
      // Cập nhật Variant với size và quantity mới
      const updatedVariant = await tx.variant.update({
        where: { id },
        data: {
          size,
          quantity: Number(quantity),
        },
      });

      // Tìm bản ghi History_Price "hoạt động" (endDate = null) cho variant
      const activeHistory = await tx.history_Price.findFirst({
        where: {
          variantId: id,
          endDate: null,
        },
        orderBy: { startDate: "desc" },
      });

      // Nếu có activeHistory và giá mới khác với giá hiện tại
      if (activeHistory && Number(price) !== activeHistory.price) {
        // Cập nhật bản ghi History_Price cũ: set endDate thành thời gian hiện tại
        await tx.history_Price.update({
          where: { id: activeHistory.id },
          data: {
            endDate: new Date().toISOString(),
          },
        });
        // Tạo bản ghi History_Price mới với giá mới
        await tx.history_Price.create({
          data: {
            variantId: id,
            price: Number(price),
            startDate: new Date().toISOString(),
            endDate: null,
          },
        });
      }
      return updatedVariant;
    });
  }

  static async delete(id) {
    // Xóa tất cả History_Price liên quan đến variant cần xóa
    await prisma.history_Price.deleteMany({
      where: {
        variantId: Number(id),
      },
    });

    // Sau đó, xóa variant
    return await prisma.variant.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

module.exports = VariantService;
