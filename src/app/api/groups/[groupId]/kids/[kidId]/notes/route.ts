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

    const note = await db.note.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        kidId: kidId,

        // FROM FRONTEND
        description: values.description,
        tagIDs: values.tagIDs,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "NOTE",
        entityId: note.id,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[CREATE_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
