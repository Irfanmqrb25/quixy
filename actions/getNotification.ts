import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export async function getNotification() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const notification = await prisma.notification.findMany({
    where: {
      userId: {
        equals: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return notification;
}
