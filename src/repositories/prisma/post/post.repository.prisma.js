import { prisma } from "../../../prisma.js";
import { postByIdMap, postAllMap } from "./post.mapper.prisma.js";

/**
 * @returns {import('../../interfaces.js').PostRepository}
 */
export const createPrismaPostRepository = () => ({
  async findAll({ status, userId, tagId, page = 1, limit = 20 } = {}) {
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (tagId)
      where.postTags = {
        some: {
          tagId: tagId,
        },
      };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          userId: true,
          title: true,
          body: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data: postAllMap(posts),
      total,
      page,
      limit,
    };
  },
  async findById(id) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        postTags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    if (!post) return null;

    return postByIdMap(post);
  },
  async create({ userId, title, body, status }) {
    const post = await prisma.post.create({
      data: {
        userId: userId,
        title,
        body,
        status,
      },
    });
    return post;
  },
  async createWithTags({ userId, title, body, status, tagIds }) {
    const post = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          userId: userId,
          title,
          body,
          status,
        },
      });

      if (tagIds.length > 0)
        await tx.postTag.createMany({
          data: tagIds.map((tagId) => ({
            postId: post.id,
            tagId,
          })),
        });

      return post;
    });

    return this.findById(post.id);
  },
  async update(id, { title, body, status }) {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: {
          title,
          body,
          status,
        },
      });
      return post;
    } catch (e) {
      if (e.code === "P2025") return null;
      throw e;
    }
  },
  async remove(id) {
    try {
      await prisma.post.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  },
});
