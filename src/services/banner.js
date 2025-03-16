const prisma = require("../config/prismaClient");

class BannerService {
  // for client
  static async getAll() {
    let query = {
      where: {
        visible: true,
      },
      include: {
        image: true,
      },
      orderBy: {
        priority: "asc",
      },
    };

    const banners = await prisma.banner.findMany(query);
    return banners;
  }

  // for client
  static async getBannerByBannerCategoryId(bannerCategoryId) {
    let query = {
      where: {
        bannerCategoryId: +bannerCategoryId,
        visible: true,
      },
      include: {
        image: true,
        bannerCategory: true,
      },
      orderBy: {
        priority: "asc",
      },
    };

    const banners = await prisma.banner.findMany(query);
    return banners;
  }

  // for admin
  static async getAllForAdmin({
    bannerSearch,
    // bannerCategoryId,
    visible,
    // limit,
    // page,
    // sortBy,
  }) {
    let query = {
      include: {
        image: true,
      },
      //   take: limit,
      //   orderBy: {
      //     priority: "asc",
      //   },
    };

    // if (visible !== "all") {
    //   if (!query.where) Object.assign(query, { where: {} });
    //   query.where.visible = visible === "true";
    // }

    let banners = await prisma.banner.findMany({ ...query });

    return {
      banners,
    };
  }

  static async create({ imageId, priority, name, visible }) {
    const newBanner = await prisma.banner.create({
      data: {
        imageId: +imageId,
        priority: +priority,
        name,
        visible,
      },
    });
    return newBanner;
  }

  static async update(bannerId, { imageId, priority, name, visible }) {
    const existBanner = await prisma.banner.findUnique({
      where: {
        priority: +priority,
      },
    });
    if (existBanner) {
      throw new Error("Banner with this priority already exist");
    }
    const updatedBanner = await prisma.banner.update({
      where: {
        id: +bannerId,
      },

      data: {
        imageId: +imageId,
        priority: +priority,
        name,
        visible,
      },
    });
    return updatedBanner;
  }
}

module.exports = BannerService;
