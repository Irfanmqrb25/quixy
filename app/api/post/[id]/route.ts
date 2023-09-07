import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id && user?.id !== params.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        postId: params.id,
      },
    });

    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
