import { prisma } from "../../../prisma.js";
import { commentMap } from "./comment.mapper.prisma.js";

/**
 * @returns {import('../../interfaces.js').CommentRepository}
 */
export const createPrismaCommentRepository = () => ({
  async findAll({ postId, page = 1, limit = 20 } = {}) {
    const where = {};
    if (postId) where.post_id = postId;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: commentMap(comments),
      total,
      page,
      limit,
    };
  },
  async findById(id) {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!comment) return null;

    return commentMap([comment])[0];
  },
  async create({ postId, authorId, body } = {}) {
    const comment = await prisma.comment.create({
      data: {
        post_id: postId,
        author_id: authorId,
        body,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return commentMap(comment);
  },
  async remove(id) {
    try {
      await prisma.comment.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  },
});
