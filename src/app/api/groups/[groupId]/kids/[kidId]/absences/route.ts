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

    const absence = await db.absence.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        kidId: kidId,

        // FROM FRONTEND
        tagIDs: values.tagIDs,
        date: values.date,
        reason: values.reason,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "ABSENCE",
        entityId: absence.id,
      },
    });

    return NextResponse.json(absence);
  } catch (error) {
    console.log("[CREATE_ABSENCE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
