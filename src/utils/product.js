const CategoryService = require("../services/category");
const {
  PRODUCT_ALL,
  PRODUCT_NEWEST,
  PRODUCT_TRENDING,
  PRODUCT_SALES,
} = require("../constant/productType");
const { commonIncludeOptionsInReview } = require("../utils/commonInclude");
const { vi } = require("date-fns/locale");

// for client
const commonIncludeOptionsInProduct = {
  images: {
    include: {
      image: true,
    },
  },
  categories: {
    include: {
      category: {
        include: {
          parent: true,
        }
      },
    }
  },
  thumbnailImage: true,
  viewImage: true,
  variants: true,
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
  // do not show invisible reviews
  // hide invisible reviews
  reviews: {
    where: {
      visible: true,
    },
    include: commonIncludeOptionsInReview
  },
};

const commonIncludeOptionsInProductAdmin = {
  images: {
    include: {
      image: true,
    },
  },
  categories: {
    include: {
      category: {
        include: {
          parent: true,
        }
      },
    }
  },
  thumbnailImage: true,
  viewImage: true,
  variants: true,
  productDiscount: true,
  reviews: {
    include: commonIncludeOptionsInReview
  },
};

const getQueryObjectBasedOnFilters = async (currentQueryObject, filters) => {
  const { productIds, categoryIds, type, discount, visible, filterMinPrice, filterMaxPrice, sortBy } = filters;
  const queryObject = { ...currentQueryObject };

  if (categoryIds.length > 0) {
    const res = await Promise.all(
      categoryIds.map((categoryId) =>
        CategoryService.getCategoriesRecursivelyFromParent(+categoryId)
      )
    );

    const recursiveCategoryIds = Array.from(new Set(res.flat()));

    queryObject.where = {
      categories: {
        some: {
          category: {
            id: {
              in: recursiveCategoryIds,
            },
          }
        }
      }
    };
  }

  if (productIds.length > 0) {
    if (queryObject.where) {
      queryObject.where.id = {
        in: productIds.map((id) => +id),
      };
    } else {
      queryObject.where = {
        id: {
          in: productIds.map((id) => +id),
        },
      };
    }
  }

  if (filterMaxPrice && filterMinPrice) {
    queryObject.where = {
      ...queryObject.where,
      variants: {
        some: {
          price: {
            gte: filterMinPrice,
            lte: filterMaxPrice,
          }
        }
      },
    }
  }

  if (sortBy?.field === "createdAt") {
    queryObject.orderBy = {
      createdAt: sortBy.direction,
    };
  }

  if (sortBy?.field === "name") {
    queryObject.orderBy = {
      name: sortBy.direction,
    };
  }

  if (type === PRODUCT_NEWEST) {
    queryObject.orderBy = {
      createdAt: "desc",
    };
    queryObject.where = {
      ...queryObject.where,
      visible: true,
    };
  }

  if (type === PRODUCT_TRENDING) {
    queryObject.orderBy = {
      soldNumber: "desc",
    };
    queryObject.where = {
      ...queryObject.where,
      visible: true,
    };
  }

  if (type === PRODUCT_SALES || discount === "dang-giam-gia") {
    if (!queryObject.where) Object.assign(queryObject, { where: {} });
    queryObject.where.productDiscount = {
      some: {
        startDate: {
          lte: new Date().toISOString(),
        },
        endDate: {
          gte: new Date().toISOString(),
        },
      },
    };
    queryObject.where = {
      ...queryObject.where,
      visible: true,
    };
  }

  if (discount === "khong-giam-gia") {
    if (!queryObject.where) Object.assign(queryObject, { where: {} });
    queryObject.where.productDiscount = {
      none: {
        startDate: {
          lte: new Date().toISOString(),
        },
        endDate: {
          gte: new Date().toISOString(),
        },
      },
    };
  }

  if (visible === "true") {
    if (!queryObject.where) Object.assign(queryObject, { where: {} });
    queryObject.where = {
      ...queryObject.where,
      visible: true,
    };
  } else if (visible === "false") {
    if (!queryObject.where) Object.assign(queryObject, { where: {} });
    queryObject.where = {
      ...queryObject.where,
      visible: false,
    };
  }

  return queryObject;
};

const getQueryFullTextSearch = (currentQueryObject, query) => {
  const searchText = query.trim().replace(/ {2,}/g, " ").toLowerCase().replace(/ /g, " & ");

  let queryObject = { ...currentQueryObject };
  queryObject.where = {
    ...queryObject.where,
    name: {
      search: searchText,
    },
  };
  queryObject.include = commonIncludeOptionsInProduct
  return queryObject;
};

module.exports = { getQueryObjectBasedOnFilters, getQueryFullTextSearch, commonIncludeOptionsInProduct, commonIncludeOptionsInProductAdmin };
