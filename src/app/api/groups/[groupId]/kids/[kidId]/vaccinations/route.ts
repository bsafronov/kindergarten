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

    const vaccination = await db.vaccination.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        kidId: kidId,

        // FROM FRONTEND
        date: values.date,
        tagId: values.tagId,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "VACCINATION",
        entityId: vaccination.id,
      },
    });

    return NextResponse.json(vaccination);
  } catch (error) {
    console.log("[CREATE_VACCINATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
