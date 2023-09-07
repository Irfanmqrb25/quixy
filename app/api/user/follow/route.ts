import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { follower, following } = body;

    if (!follower || !following) {
      return new NextResponse("All Parameters are required", { status: 400 });
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: follower,
        followingId: following,
      },
    });

    if (existingFollow) {
      return new NextResponse("action denied", { status: 400 });
    }

    await prisma.follow.create({
      data: {
        followerId: follower,
        followingId: following,
      },
    });

    const followerUser = await prisma.user.findUnique({
      where: {
        id: follower,
      },
      select: {
        id: true,
        image: true,
        username: true,
        name: true,
      },
    });

    if (followerUser) {
      const notification = await prisma.notification.create({
        data: {
          body: "started following you",
          userId: following,
          createdById: followerUser.id,
          type: "follow",
          createdByName:
            (followerUser?.username as string) ||
            (followerUser?.name as string),
          avatar: followerUser.image,
        },
      });

      pusherServer.trigger(following, "follow", notification);
    }

    return new NextResponse("Follow successful", { status: 200 });
  } catch (error: any) {
    console.log(error.message, "USER_FOLLOW_ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { follower, following } = body;

    if (!follower || !following) {
      return new NextResponse("All Parameters are required", { status: 400 });
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: follower,
        followingId: following,
      },
    });

    if (!existingFollow) {
      return new NextResponse("No existing follow relationship", {
        status: 400,
      });
    }

    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        userId: following,
        createdById: follower,
        type: "follow",
      },
    });

    return new NextResponse("Unfollow successful", { status: 200 });
  } catch (error: any) {
    console.log(error.message, "USER_UNFOLLOW_ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
