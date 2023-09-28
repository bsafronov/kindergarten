import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();
    const { groupId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kid = await db.kid.create({
      data: {
        createdBy: userId,
        groupId: groupId,

        // FROM FRONTEND
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.lastName,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "KID",
        entityId: kid.id,
      },
    });

    return NextResponse.json(kid);
  } catch (error) {
    console.log("[CREATE_KID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
