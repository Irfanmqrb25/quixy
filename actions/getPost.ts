import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export async function getPosts() {
  try {
    const posts = prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        images: true,
        likes: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return posts;
  } catch (error) {
    return [];
  }
}

export async function getPostsByFollowing() {
  const currentUser = await getCurrentUser();

  try {
    const followingUserIds = currentUser?.following.map(
      (user) => user.followingId
    );

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            userId: currentUser?.id,
          },
          {
            userId: {
              in: followingUserIds,
            },
          },
        ],
      },
      include: {
        user: true,
        likes: true,
        comments: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    return [];
  }
}
