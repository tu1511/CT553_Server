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

  static async getById(articleId) {
    return await prisma.article.findUnique({
      where: {
        id: +articleId,
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

  static async update(articleId, { title, author, content, visible }) {
    if (visible) {
      await prisma.article.updateMany({
        where: { visible: true },
        data: { visible: false },
      });
    }
    return await prisma.article.update({
      where: { id: +articleId },
      data: { title, author, content, visible },
    });
  }

  static async toggleVisibility(articleId) {
    const article = await prisma.article.findUnique({
      where: { id: +articleId },
      select: { visible: true },
    });

    if (!article) throw new Error("Article not found");

    if (!article.visible) {
      await prisma.article.updateMany({
        where: { visible: true },
        data: { visible: false },
      });
    }

    return prisma.article.update({
      where: { id: +articleId },
      data: { visible: !article.visible },
    });
  }
}

module.exports = ArticleService;
