const prisma = require("../config/prismaClient");

class ArticleService {
  static async getAll() {
    return await prisma.article.findMany({
      include: {
        thumbnailImage: true,
      },
    });
  }

  static async getVisible() {
    return await prisma.article.findFirst({
      where: {
        visible: true,
      },
    });
  }

  static async getOneBySlug(slug) {
    return await prisma.article.findFirst({
      where: {
        slug,
        visible: true,
      },
      include: {
        thumbnailImage: true,
      },
    });
  }

  static async create({
    title,
    slug,
    author,
    thumbnailImageId,
    content,
    visible,
  }) {
    return await prisma.article.create({
      data: {
        title,
        slug,
        thumbnailImageId,
        author,
        content,
        visible,
      },
    });
  }

  static async update(articleId, updatedData) {
    return await prisma.article.update({
      where: {
        id: +articleId,
      },
      data: updatedData,
    });
  }

  static async delete(articleId) {
    await prisma.article.delete({ where: { id: articleId } });
  }
}

module.exports = ArticleService;
