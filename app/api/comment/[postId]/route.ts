import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  if (!postId) {
    return new NextResponse("Parameters are required", { status: 400 });
  }

  const post = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      post: true,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  const user = await getCurrentUser();
  const body = await req.json();

  const { postOwnerId, commentUserId } = body;

  if (!postId || !postOwnerId || !commentUserId) {
    return new NextResponse("All parameters are required", { status: 400 });
  }

  if (user?.id !== commentUserId && user?.id !== postOwnerId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.comment.delete({
    where: {
      id: postId,
    },
  });

  await prisma.notification.deleteMany({
    where: {
      createdById: commentUserId,
    },
  });

  return new NextResponse("Comment deleted successfully", { status: 200 });
}
