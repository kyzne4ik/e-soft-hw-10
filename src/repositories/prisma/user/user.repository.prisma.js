import { prisma } from "../../../prisma.js";

/**
 * @returns {import('../interfaces.js').UserRepository}
 */
export const createPrismaUserRepository = () => ({
  async findAll({ page = 1, limit = 20, role } = {}) {
    const where = {};
    if (role) where.role = role;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  },
  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return user;
  },
  async create({ email, name, role } = {}) {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
      },
    });

    return user;
  },
  async update(id, { email, name, role }) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email,
          name,
          role,
        },
      });

      return user;
    } catch (e) {
      if (e.code === "P2025") return null;
      throw e;
    }
  },
  async remove(id) {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return true;
    } catch (e) {
      if (e.code === "P2025") return false;
      throw e;
    }
  },
});
