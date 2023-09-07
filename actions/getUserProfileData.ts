import getCurrentUser from "./getCurrentUser";
import prisma from "@/lib/prisma";

export default async function getUserProfileData() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return null;
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        posts: true,
      },
    });

    return userData;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}
