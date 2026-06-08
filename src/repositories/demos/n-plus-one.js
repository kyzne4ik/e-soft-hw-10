import { prisma } from "../../prisma.js";

const posts_bad = await prisma.post.findMany();
for (const post of posts_bad) {
  const user = await prisma.user.findUnique({ where: { id: post.user_id } });

  console.log(`"${post.title}" by ${user.name}`);
}
// N+1 запросов

const posts_good = await prisma.post.findMany({
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
});

for (const post of posts_good) {
  console.log(`"${post.title}" by ${post.user.name}`);
}
// 1-2 запроса
