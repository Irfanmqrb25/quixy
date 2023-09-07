import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, postId, text } = body;

    if (!userId || !postId || !text) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (post.userId !== userId) {
      const comment = await prisma.comment.create({
        data: {
          userId,
          postId,
          text,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const image = await prisma.image.findMany({
        where: {
          postId: postId,
        },
      });

      const notification = await prisma.notification.create({
        data: {
          body: text,
          userId: post.userId,
          createdById: userId,
          postId: postId,
          type: "comment",
          createdByName: (user?.username as string) || (user?.name as string),
          images: image[0].url,
          avatar: user?.image,
        },
      });

      pusherServer.trigger(post.userId, "comment", notification);

      return NextResponse.json(comment);
    } else {
      const comment = await prisma.comment.create({
        data: {
          userId,
          postId,
          text,
        },
      });

      return NextResponse.json(comment);
    }
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
