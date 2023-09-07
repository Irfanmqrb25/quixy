import prisma from "@/lib/prisma";

import getSession from "./getSession";
import getCurrentUser from "./getCurrentUser";

export const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: session?.user?.email,
        },
      },
    });

    return users;
  } catch (errora: any) {
    return [];
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: {
          include: {
            images: true,
          },
        },
        likes: true,
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    return user;
  } catch (error: any) {
    return null;
  }
};

export const getFeaturedUser = async () => {
  const user = await getCurrentUser();

  try {
    const featuredUser = await prisma.user.findMany({
      where: {
        isFeatured: true,
        NOT: {
          id: user?.id,
        },
      },
    });

    return featuredUser;
  } catch (error) {
    return [];
  }
};
