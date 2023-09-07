import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!id || !user?.id) {
      return new NextResponse("Parameters are required", { status: 400 });
    }

    const like = await prisma.like.create({
      data: {
        userId: user.id,
        postId: id,
      },
      include: {
        post: {
          include: {
            images: true,
          },
        },
      },
    });

    // Check if the user who liked the post is not the post owner
    if (like.post.userId !== user.id) {
      const notification = await prisma.notification.create({
        data: {
          body: "Liked your post",
          userId: like.post.userId,
          createdById: user.id,
          type: "like",
          createdByName: (user.username as string) || (user.name as string),
          avatar: user.image,
          postId: like.post.id,
          images: like.post.images[0]?.url,
        },
      });

      pusherServer.trigger(like.post.userId, "like", notification);
    }

    return new NextResponse("Post Liked successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!id || !user?.id) {
      return new NextResponse("Parameters are required", { status: 400 });
    }

    await prisma.like.deleteMany({
      where: {
        postId: id,
      },
    });

    const likesPost = await prisma.like.findFirst({
      where: {
        postId: id,
      },
      include: {
        post: true,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        userId: likesPost?.post.userId,
        createdById: user.id,
        type: "like",
      },
    });

    return new NextResponse("Post unliked successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
