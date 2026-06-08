import { prisma } from "../../../prisma.js";

/**
 * @returns {import('../interfaces.js').TagRepository}
 */
export const createPrismaTagRepository = () => ({
  async findAll() {
    return await prisma.tag.findMany();
  },
  async findById(id) {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) return null;

    return tag;
  },
  async findByName(name) {
    return await prisma.tag.findUnique({
      where: { name },
    });
  },
  async create({ name }) {
    const tag = await prisma.tag.create({
      data: { name },
    });
    return tag;
  },
  async attachToPost(postId, tagId) {
    const existing = await prisma.postTag.findUnique({
      where: {
        postId_tagId: {
          postId,
          tagId,
        },
      },
    });

    if (existing) return;

    await prisma.postTag.create({
      data: {
        postId,
        tagId,
      },
    });
  },
  async detachFromPost(postId, tagId) {
    try {
      await prisma.postTag.delete({
        where: {
          postId_tagId: {
            postId,
            tagId,
          },
        },
      });
      return true;
    } catch (e) {
      if (e.code === "P2025") return false;
      throw e;
    }
  },
});
