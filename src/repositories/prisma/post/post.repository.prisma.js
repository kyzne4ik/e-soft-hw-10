import { prisma } from "../../../prisma.js";
import { postByIdMap, postAllMap } from "./post.mapper.prisma.js";

/**
 * @returns {import('../../interfaces.js').PostRepository}
 */
export const createPrismaPostRepository = () => ({
  async findAll({ status, userId, tagId, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    if (userId) where.user_id = userId;
    if (tagId)
      where.postTags = {
        some: {
          tag_id: tagId,
        },
      };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          user_id: true,
          title: true,
          body: true,
          status: true,
          created_at: true,
          updated_at: true,
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              comment: true,
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
        comment: {
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
        user_id: userId,
        title,
        body,
        status,
      },
    });
    return post ?? null;
  },
  async createWithTags({ userId, title, body, status, tagIds }) {
    const post = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          user_id: userId,
          title,
          body,
          status,
        },
      });

      if (tagIds.length > 0)
        await tx.postTag.createMany({
          data: tagIds.map((tag_id) => ({
            post_id: post.id,
            tag_id,
          })),
        });

      return await tx.post.findUnique({
        where: { id: post.id },
        include: { postTags: true, user: true },
      });
    });

    return this.findById(post.id);
  },
  async update(id, { title, body, status }) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return null;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        body,
        status,
      },
    });
    return post;
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
