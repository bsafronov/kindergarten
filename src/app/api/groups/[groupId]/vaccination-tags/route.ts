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

    const vaccinationTag = await db.vaccinationTag.create({
      data: {
        createdBy: userId,
        groupId: groupId,

        // FROM FRONTEND
        label: values.label,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: groupId,
        actionType: "CREATE",
        entityType: "VACCINATION_TAG",
        entityId: vaccinationTag.id,
      },
    });

    return NextResponse.json(vaccinationTag);
  } catch (error) {
    console.log("[CREATE_VACCINATION_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
