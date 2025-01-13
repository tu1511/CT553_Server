const slugify = require("slugify");
const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const fs = require("fs").promises;
const path = require("path");
const {
  PRODUCT_ALL,
  PRODUCT_NEWEST,
  PRODUCT_TRENDING,
  PRODUCT_SALES,
} = require("../constant/productType");
// const {
//   generateEmbeddingsFromText,
//   generateEmbeddingsFromTextV2,
//   generateEmbeddingsFromImageUrl,
// } = require("../utils/generateEmbeddings");
const { getUploadedImageId, getUploadedImageIds } = require("../utils");
const { Prisma } = require("@prisma/client");
// const {
//   getQueryObjectBasedOnFilters,
//   commonIncludeOptionsInProduct,
//   commonIncludeOptionsInProductAdmin,
// } = require("../utils/product");
const { getProduct, getAllProductLinks } = require("./uploadData/crawlData");
// const RecommendService = require("./recommend");

class ProductService {
  // crawl
  static async crawl({ url, categorySlugs }) {
    const productData = await getProduct(url);

    const findProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
      },
    });

    if (findProduct) {
      return `Product ${productData.name} already exists`;
    }

    console.log("productData", productData);

    // get category
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          in: categorySlugs,
        },
      },
      select: {
        id: true,
      },
    });

    console.log("categories", categories);

    // upload thumbnail image
    // const thumbnailImageId = await getUploadedImageId(
    //   productData.thumbnailImage
    // );
    // console.log("thumbnailImageId", thumbnailImageId);

    // upload view image
    // let viewImageId;
    // if (productData.viewImage) {
    //   viewImageId = await getUploadedImageId(productData.viewImage);
    //   console.log("viewImageId", viewImageId);
    // } else {
    //   console.log("No view image " + productData.name);
    // }

    // upload images
    let uploadedImageIds = [];
    if (productData.images.length !== 0) {
      uploadedImageIds = await getUploadedImageIds(productData.images);
      console.log("uploadedImageIds", uploadedImageIds);
    } else {
      console.log("No images " + productData.name);
    }

    // create product
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: productData.name,
          overview: productData.overview,
          description: productData.description,
          material: productData.material,
          color: productData.color,
          stone: productData.stone,
          gender: productData.gender,
          completion: productData.completion,
          // thumbnailImageId,
          // viewImageId,
          slug: slugify(productData.name, { lower: true }),
        },
      });

      await tx.variant.createMany({
        data: productData.variants.map((variant) => ({
          size: variant.size,
          price: variant.price,
          quantity: 10,
          productId: createdProduct.id,
        })),
      });

      await tx.productImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          productId: createdProduct.id,
        })),
      });

      await tx.productCategory.createMany({
        data: categories.map((category) => ({
          categoryId: category.id,
          productId: createdProduct.id,
        })),
      });

      return createdProduct;
    });

    // create embeddings
    // await ProductService.createEmbeddingsForProduct(newProduct.id);

    return newProduct;
  }

  static async crawlMany({ categorySlugs, urls }) {
    return await Promise.all(
      urls.map(async (url) => {
        return await ProductService.crawl({ url, categorySlugs });
      })
    );
  }

  static async crawlCategory({ categorySlugs, url }) {
    const links = await getAllProductLinks(url);
    return await ProductService.crawlMany({ categorySlugs, urls: links });
  }

  static async create({
    uploadedImageIds,
    categoryIds,
    variants,
    discounts,
    ...data
  }) {
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          ...data,
        },
      });

      await tx.variant.createMany({
        data: variants.map((variant) => ({
          size: variant.size,
          price: +variant.price,
          quantity: +variant.quantity,
          productId: createdProduct.id,
        })),
      });

      await tx.productDiscount.createMany({
        data: discounts.map((discount) => ({
          productId: createdProduct.id,
          discountType: discount.discountType,
          discountValue: +discount.discountValue,
          startDate: new Date(discount.startDate).toISOString(),
          endDate: new Date(discount.endDate).toISOString(),
        })),
      });

      await tx.productImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          productId: createdProduct.id,
        })),
      });

      await tx.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          categoryId: categoryId,
          productId: createdProduct.id,
        })),
      });

      return createdProduct;
    });

    // create embeddings
    // await ProductService.createEmbeddingsForProduct(newProduct.id);

    return newProduct;
  }

  static async createEmbeddingsForProduct(productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        name: true,
        overview: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        images: {
          select: {
            image: {
              select: {
                id: true,
                path: true,
              },
            },
          },
        },
        thumbnailImage: {
          select: {
            id: true,
            path: true,
          },
        },
        viewImage: {
          select: {
            id: true,
            path: true,
          },
        },
      },
    });

    const categoryNames = product.categories
      .map((category) => category.category.name)
      .join(" ");

    const textToTransform = `${product.name} ${categoryNames} ${product.overview}`;
    const embedding = await generateEmbeddingsFromTextV2(textToTransform);

    await prisma.$queryRaw`
    INSERT INTO product_embeddings (product_id, embedding) VALUES (${productId} , ${embedding}::vector)`;

    const images = product.images.map((image) => {
      return { id: image.image.id, path: image.image.path };
    });
    const thumbnailImage = {
      id: product.thumbnailImage.id,
      path: product.thumbnailImage.path,
    };
    let viewImage = null;
    if (product.viewImage) {
      viewImage = { id: product.viewImage.id, path: product.viewImage.path };
    }
    // const viewImage = { id: product.viewImage.id, path: product.viewImage.path };
    let allImages = [];
    if (viewImage) {
      allImages = [thumbnailImage, viewImage, ...images];
    } else {
      allImages = [thumbnailImage, ...images];
    }

    Promise.all(
      allImages.map(async (image) => {
        const embedding = await generateEmbeddingsFromImageUrl(image.path);
        await prisma.$queryRaw`
      INSERT INTO product_image_embeddings (product_id, image_id, embedding) VALUES (${productId}, ${image.id}, ${embedding}::vector)`;
      })
    );
  }

  static async getAll({
    productSearch,
    type = PRODUCT_ALL,
    categoryIds = [],
    productIds = [],
    page = 1,
    limit = 8,
    discount,
    visible,
    filterMinPrice,
    filterMaxPrice,
    sortBy,
  }) {
    let query = {
      include: commonIncludeOptionsInProduct,
      take: limit,
    };

    query = await getQueryObjectBasedOnFilters(query, {
      categoryIds,
      productIds,
      type,
      discount,
      visible,
      filterMaxPrice,
      filterMinPrice,
      sortBy,
    });

    // search
    if (productSearch) {
      // if productSearch is a number, search by id
      if (!query.where) Object.assign(query, { where: {} });
      if (!isNaN(productSearch)) {
        query.where = { ...query.where, id: +productSearch };
      } else {
        query.where = {
          ...query.where,
          name: {
            contains: productSearch,
            mode: "insensitive",
          },
        };
      }
    }

    // sort by rating
    if (sortBy?.field === "rating") {
      // remove limit field
      query = { ...query, take: undefined };
      let products = await prisma.product.findMany({
        ...query,
      });
      let productWithRatings = products.map((product) => {
        const reviews = product.reviews;
        console.log("reviews", reviews);
        if (!reviews.length) {
          return { ...product, rating: 0 };
        }
        const totalRating = reviews.reduce((acc, review) => {
          return acc + review.rating;
        }, 0);
        const rating = (totalRating / reviews.length).toFixed(1);
        return { ...product, rating };
      });

      console.log("productWithRatings", productWithRatings);
      for (let product of productWithRatings) {
        console.log("product", product.id, product.rating);
      }

      if (sortBy.direction === "asc") {
        productWithRatings = productWithRatings.sort(
          (a, b) => a.rating - b.rating
        );
      } else {
        productWithRatings = productWithRatings.sort(
          (a, b) => b.rating - a.rating
        );
      }
      // remove rating field
      products = productWithRatings.map(({ rating, ...product }) => product);

      const offset = page > 1 ? (page - 1) * limit : 0;
      const totalPages = Math.ceil(productWithRatings.length / limit);

      return {
        products: productWithRatings.slice(offset, offset + limit),
        pagination: {
          totalProducts: productWithRatings.length,
          totalPages,
        },
      };
    }

    const count = await prisma.product.count({
      where: query.where,
    });

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);

    let products = await prisma.product.findMany({ ...query, skip: offset });

    products = products.map((product) => {
      let sortedVariants = product.variants.sort((a, b) => a.price - b.price);
      // calculate sum of quantity of variants
      let totalQuantity = sortedVariants.reduce(
        (acc, variant) => acc + variant.quantity,
        0
      );
      return { ...product, variants: sortedVariants, totalQuantity };
    });

    query;
    return {
      products,
      pagination: {
        totalProducts: count,
        totalPages,
      },
    };
  }

  static async getOne(productId) {
    const product = prisma.product.findUnique({
      where: {
        id: productId,
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    });

    const sortedVariants = product.variants.sort((a, b) => a.price - b.price);

    return { ...product, variants: sortedVariants };
  }

  static async getOneBySlug(productSlug) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    });

    const sortedVariants = product.variants.sort((a, b) => a.price - b.price);

    return { ...product, variants: sortedVariants };
  }

  static async getOneBySlugWithAllDiscounts(productSlug) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: commonIncludeOptionsInProductAdmin,
    });

    const sortedVariants = product.variants.sort((a, b) => a.price - b.price);

    return { ...product, variants: sortedVariants };
  }

  static async update(productId, updatedData) {
    return await prisma.product.update({
      where: {
        id: productId,
      },
      data: updatedData,
    });
  }

  static async toggleHide(productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: +productId,
      },
      select: {
        visible: true,
      },
    });

    return prisma.product.update({
      where: {
        id: +productId,
      },
      data: {
        visible: !product.visible,
      },
    });
  }

  static async delete(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    await Promise.all(
      product.images.map((image) => UploadService.destroyImage(image.imageId))
    );

    await prisma.product.delete({ where: { id: productId } });
  }

  static async addImage(productId, { uploadedImageId }) {
    return await prisma.productImage.create({
      data: {
        productId,
        imageId: uploadedImageId,
      },
    });
  }

  static async deleteImage(productImageId, filename) {
    const { imageId } = await prisma.productImage.findUnique({
      where: {
        id: productImageId,
      },
    });

    await Promise.all([
      prisma.productImage.delete({
        where: {
          id: productImageId,
        },
      }),
      UploadService.destroyImage(imageId),
    ]);
  }

  static async addCategory(productId, { categoryId }) {
    return await prisma.productCategory.create({
      data: {
        productId,
        categoryId,
      },
    });
  }

  static async deleteCategory(productId, categoryId) {
    await Promise.all([
      prisma.productCategory.delete({
        where: {
          categoryId_productId: {
            categoryId,
            productId,
          },
        },
      }),
    ]);
  }

  static async search(query) {
    const trimmedQuery = query
      .trim()
      .replace(/ {2,}/g, " ")
      .toLowerCase()
      .replace(/ /g, " & ");

    console.log("trimmedQuery", trimmedQuery);

    const fullTextSearchResult = await ProductService.fullTextSearch(
      trimmedQuery
    );

    const semanticSearchResult = await ProductService.semanticSearch(
      trimmedQuery,
      fullTextSearchResult
    );

    return {
      fullTextSearchResult,
      semanticSearchResult,
    };
  }

  static async getAllTextEmbeddings() {
    return await prisma.productEmbeddings.findMany();
  }

  static async createTextEmbeddingsForAllProducts() {
    // await prisma.$queryRaw`TRUNCATE TABLE product_embeddings RESTART IDENTITY`;

    let products = await prisma.product.findMany({
      // where: {
      //   id: {
      //     in: [19, 20, 58, 203,
      //       210, 207, 209, 211,
      //       205]
      //   }
      // },
      select: {
        id: true,
        name: true,
        overview: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // find product that has no embeddings
    let hasEmbeddings = await prisma.productEmbeddings.findMany({
      select: {
        productId: true,
      },
    });

    hasEmbeddings = hasEmbeddings.map((item) => item.productId);

    products = products.filter(
      (product) => !hasEmbeddings.includes(product.id)
    );

    const productIds = products.map((product) => product.id);
    console.log("productIds", productIds);

    Promise.all(
      products.map(async (product) => {
        const categoryNames = product.categories
          .map((category) => category.category.name)
          .join(" ");

        const textToTransform = `${product.name} ${categoryNames} ${product.overview}`;
        const embedding = await generateEmbeddingsFromTextV2(textToTransform);

        await prisma.$queryRaw`
        INSERT INTO product_embeddings (product_id, embedding) VALUES (${product.id} , ${embedding}::vector)`;
      })
    );
  }

  static async getAllImageEmbeddings() {
    // return await prisma.productImageEmbeddings.findMany();
    const res = await prisma.productImageEmbeddings.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return res.slice(0, 5);
  }

  static async createImageEmbeddingsForAllProducts() {
    // await prisma.$queryRaw`TRUNCATE TABLE product_image_embeddings RESTART IDENTITY`;

    let products = await prisma.product.findMany({
      select: {
        id: true,
        images: {
          select: {
            image: {
              select: {
                id: true,
                path: true,
              },
            },
          },
        },
        thumbnailImage: {
          select: {
            id: true,
            path: true,
          },
        },
        viewImage: {
          select: {
            id: true,
            path: true,
          },
        },
      },
    });

    // find product that has no embeddings
    // let hasEmbeddings = await prisma.productImageEmbeddings.findMany({
    //   select: {
    //     productId: true,
    //   },
    // });

    // hasEmbeddings = hasEmbeddings.map((item) => item.productId);

    // products = products.filter((product) => !hasEmbeddings.includes(product.id));

    products = products.slice(0, 5);

    products.map(async (product) => {
      let images = product.images.map((image) => {
        return { id: image.image.id, path: image.image.path };
      });
      let thumbnailImage = {
        id: product.thumbnailImage.id,
        path: product.thumbnailImage.path,
      };
      let allImages = [thumbnailImage, ...images];
      if (product.viewImage) {
        let viewImage = {
          id: product.viewImage.id,
          path: product.viewImage.path,
        };
        allImages = [thumbnailImage, viewImage, ...images];
      }
      console.log("product.id", product.id);

      Promise.all(
        allImages.map(async (image) => {
          try {
            const embedding = await generateEmbeddingsFromImageUrl(image.path);
            // console.log("embedding", embedding);
            await prisma.$queryRaw`
          INSERT INTO product_image_embeddings (product_id, image_id, embedding) VALUES (${product.id}, ${image.id}, ${embedding}::vector)`;
          } catch (error) {
            console.log("error", error);
          }
        })
      );
    });
  }

  static async fullTextSearch(query) {
    const searchQuery = {
      where: {
        name: {
          search: query,
        },
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    };

    return await prisma.product.findMany(searchQuery);
  }

  static async semanticSearch(query, fullTextSearchResult = []) {
    const embeddings = await generateEmbeddingsFromTextV2(query.toLowerCase());

    // console.log("embeddings", embeddings);

    const fullTextSearchResultIds = fullTextSearchResult.map((item) => item.id);
    if (fullTextSearchResultIds.length === 0) {
      fullTextSearchResultIds.push(-1);
    }

    console.log("fullTextSearchResultIds", fullTextSearchResultIds);

    let result;
    let threshold = fullTextSearchResult.length > 0 ? 0.3 : 0.6;
    // let threshold = 0.3;
    console.log("threshold", threshold);

    result =
      await prisma.$queryRaw`SELECT 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE 1 - (embedding <=> ${embeddings}:: vector) >= ${threshold} AND product_id NOT IN(${Prisma.join(
        fullTextSearchResultIds
      )}) ORDER BY cosine_similarity DESC LIMIT 10; `;

    console.log("Semantic result", result);

    const productLists = await prisma.product.findMany({
      where: {
        id: {
          in: result.map((item) => item.product_id),
        },
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    });

    // sort by result order
    const sortedProducts = [];
    for (let item of result) {
      const product = productLists.find(
        (product) => product.id === item.product_id
      );
      sortedProducts.push(product);
    }
    return sortedProducts;
  }

  // hien thi 5 san pham lien quan
  static async getRelatedProductsBasedOnText(productId) {
    console.log("productId", productId);
    const productEmbedding =
      await prisma.$queryRaw`SELECT embedding:: text, product_id FROM product_embeddings WHERE product_id = ${productId} ORDER BY product_id ASC; `;

    console.log("productEmbedding", productEmbedding);
    const recommendProductIds = [];

    let result =
      await prisma.$queryRaw`SELECT 1 - (embedding <=> ${productEmbedding[0].embedding}::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE product_id <> ${productId}
ORDER BY cosine_similarity DESC; `;

    console.log("result", result);

    for (let item of result) {
      recommendProductIds.push(item.product_id);
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: recommendProductIds,
        },
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    });

    console.log("products", products.length);

    // sort by result order
    let sortedProducts = [];
    for (let item of result) {
      const product = products.find(
        (product) => product.id === item.product_id
      );
      sortedProducts.push(product);
    }

    // remove null
    sortedProducts = sortedProducts.filter((item) => item);

    sortedProducts = sortedProducts.slice(0, 5);

    return sortedProducts;
  }

  static async getRecommendProducts(accountId) {
    // base on ratings
    let recommendProductIds =
      await ProductService.getRecommendProductsBasedOnRatings(accountId);
    if (recommendProductIds.length < 10) {
      // base on orders
      const recommendProductsBasedOnOrderIds =
        await ProductService.getRecommendProductsBasedOnOrders(accountId);
      recommendProductIds = [
        ...recommendProductIds,
        ...recommendProductsBasedOnOrderIds,
      ];
      // remove duplicate
      recommendProductIds = [...new Set(recommendProductIds)];

      if (recommendProductIds.length < 10) {
        // base on view
        const recommendProductsBasedOnViewCountIds =
          await ProductService.getRecommendProductsBasedOnViewCounts(accountId);
        recommendProductIds = [
          ...recommendProductIds,
          ...recommendProductsBasedOnViewCountIds,
        ];

        // remove duplicate
        recommendProductIds = [...new Set(recommendProductIds)];
      }
    }

    console.log("recommendProductIds", recommendProductIds);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: recommendProductIds,
        },
        visible: true,
      },
      include: commonIncludeOptionsInProduct,
    });

    let sortedProducts = recommendProductIds.map((id) =>
      products.find((product) => product.id === id)
    );

    return sortedProducts;
  }

  static async getRecommendProductsBasedOnOrders(accountId) {
    const orders = await prisma.order.findMany({
      where: {
        buyerId: accountId,
      },
      include: {
        orderDetail: {
          include: {
            variant: {
              select: {
                productId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders.length === 0) {
      return [];
    }

    const productIds = new Set();

    orders.forEach((order) => {
      order.orderDetail.forEach((orderDetail) => {
        if (productIds.size > 10) return;
        productIds.add(orderDetail.variant.productId);
      });
    });

    let limit = Math.floor(10 / productIds.size);

    const productEmbeddings =
      await prisma.$queryRaw`SELECT embedding:: text, product_id FROM product_embeddings WHERE product_id IN(${Prisma.join(
        Array.from(productIds)
      )}) ORDER BY product_id ASC; `;

    const recommendProductIds = [];
    const excludedProductIds = Array.from(productIds);
    for (let productEmbeddingIndex in productEmbeddings) {
      if (productEmbeddingIndex == productEmbeddings.length - 1) {
        limit = 10 - recommendProductIds.length;
      }
      const productEmbedding = productEmbeddings[productEmbeddingIndex];
      let result = await prisma.$queryRaw`SELECT 1 - (embedding <=> ${
        productEmbedding.embedding
      }::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE product_id NOT IN(${Prisma.join(
        excludedProductIds
      )}) ORDER BY cosine_similarity DESC LIMIT ${limit}; `;

      for (let item of result) {
        recommendProductIds.push(item.product_id);
        excludedProductIds.push(item.product_id);
      }
    }

    return recommendProductIds;
  }

  static async getRecommendProductsBasedOnRatings(accountId) {
    let productIds = await RecommendService.getRecommendBaseOneRatings(
      accountId
    );
    productIds = productIds.map((item) => item.productId);

    return productIds;
  }

  static async getRecommendProductsBasedOnViewCounts(accountId) {
    let productIds = await RecommendService.getRecommendBaseOnViewCounts(
      accountId
    );
    productIds = productIds.map((item) => item.productId);

    return productIds;
  }

  static async imageSearch(imageUrl, uploadedImagePath) {
    // remove all files in uploads folder
    const currentFile = path.basename(imageUrl);
    await ProductService.removeAllFilesAsync(
      path.join(__dirname, "..", "..", "uploads"),
      currentFile
    )
      .then(() => console.log("All files have been removed asynchronously."))
      .catch(console.error);

    // const embeddingRESULT = await generateEmbeddingsFromImageUrl(imageUrl);
    // console.log("embeddingRESULT", embeddingRESULT);

    const embeddings = Array.from(
      await generateEmbeddingsFromImageUrl(imageUrl)
    );
    const foundResults = [];
    const exclusiveProductIds = [-1];
    let result;
    do {
      result =
        await prisma.$queryRaw`SELECT product_id, 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, image_id FROM product_image_embeddings WHERE product_id NOT IN(${Prisma.join(
          exclusiveProductIds
        )}) ORDER BY cosine_similarity DESC LIMIT 1`;

      if (result.length > 0) {
        foundResults.push(result[0]);
        exclusiveProductIds.push(result[0].product_id);
      }
    } while (
      result.length > 0 &&
      result[0].cosine_similarity > 0.6 &&
      foundResults.length < 10
    );

    const products = [];

    for (let foundResult of foundResults) {
      const product = await prisma.product.findUnique({
        where: {
          id: foundResult.product_id,
          visible: true,
        },
        include: commonIncludeOptionsInProduct,
      });
      products.push({ ...product, similarImageId: foundResult.image_id });
    }

    // if (uploadedImagePath) {
    //   rm(uploadedImagePath, (err) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //   });
    // }

    return products;
  }

  static async removeAllFilesAsync(directory, currentFile) {
    const files = await fs.readdir(directory);

    for (const file of files) {
      if (file === currentFile) {
        continue;
      }
      const filePath = path.join(directory, file);
      await fs.unlink(filePath);
    }
  }
}

module.exports = ProductService;
