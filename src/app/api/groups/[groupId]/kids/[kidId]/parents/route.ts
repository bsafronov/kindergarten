import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { kidId: string; groupId: string } }
) {
  try {
    const { userId } = auth();
    const { kidId, groupId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parent = await db.parent.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        kidIDs: [kidId],

        // FROM FRONTEND
        role: values.role,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "PARENT",
        entityId: parent.id,
      },
    });

    return NextResponse.json(parent);
  } catch (error) {
    console.log("[CREATE_PARENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
