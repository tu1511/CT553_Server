const prisma = require("../config/prismaClient");

class PolicyService {
  static async getAll() {
    return await prisma.policy.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  static async getCurrent() {
    return await prisma.policy.findFirst({
      where: {
        visible: true,
      },
    });
  }

  static async getOneBySlug(slug) {
    return await prisma.policy.findUnique({
      where: {
        slug: slug,
        visible: true,
      },
    });
  }

  static async create({ title, slug, content, visible }) {
    const newPolicy = await prisma.policy.create({
      data: {
        title,
        slug,
        content,
        visible,
      },
    });
    return newPolicy;
  }

  static async update(policyId, updatedData) {
    const updatedPolicy = await prisma.policy.update({
      where: {
        id: +policyId,
      },
      data: updatedData,
    });
    return updatedPolicy;
  }

  static async delete(policyId) {
    await prisma.policy.delete({ where: { id: policyId } });
  }
}

module.exports = PolicyService;
