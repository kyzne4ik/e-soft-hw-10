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
        post_id_tag_id: {
          post_id: postId,
          tag_id: tagId,
        },
      },
    });

    if (existing) return;

    await prisma.postTag.create({
      data: {
        post_id: postId,
        tag_id: tagId,
      },
    });
  },
  async detachFromPost(postId, tagId) {
    const existing = await prisma.postTag.findUnique({
      where: {
        post_id_tag_id: {
          post_id: postId,
          tag_id: tagId,
        },
      },
    });

    if (!existing) return false;

    try {
      await prisma.postTag.delete({
        where: {
          post_id_tag_id: {
            post_id: postId,
            tag_id: tagId,
          },
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  },
});
