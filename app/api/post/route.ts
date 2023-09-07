import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { images, caption } = body;

    if (!images || !caption) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        caption,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.log(error.message, "POST_UPLOAD_ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
