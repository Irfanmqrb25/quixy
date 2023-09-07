import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await getCurrentUser();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    if (!query) {
      return new NextResponse("query is required", { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        NOT: {
          id: user?.id, // Exclude the current user
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.log(error.message, "SEARCH_ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
