import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const groups = await db.group.findMany({
      where: {
        userIDs: {
          has: userId,
        },
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.log("[GET_GROUPS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  const values = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const group = await db.group.create({
      data: {
        createdBy: userId,
        adminIDs: [userId],
        userIDs: [userId],

        // FROM FRONTEND
        title: values.title,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: group.id,
        actionType: "CREATE",
        entityType: "GROUP",
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[CREATE_GROUP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
