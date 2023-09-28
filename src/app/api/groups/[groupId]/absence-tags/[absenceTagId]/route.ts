import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { absenceTagId: string } }
) {
  try {
    const { userId } = auth();
    const { absenceTagId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const absenceTag = await db.absenceTag.update({
      where: {
        id: absenceTagId,
      },
      data: {
        updatedBy: userId,

        // FROM FRONTEND
        label: values.label,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: absenceTag.groupId,
        actionType: "UPDATE",
        entityType: "ABSENCE_TAG",
        entityId: absenceTag.id,
      },
    });

    return NextResponse.json(absenceTag);
  } catch (error) {
    console.log("[UPDATE_ABSENCE_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { absenceTagId: string } }
) {
  try {
    const { userId } = auth();
    const { absenceTagId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const absenceTag = await db.absenceTag.delete({
      where: {
        id: absenceTagId,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: absenceTag.groupId,
        actionType: "DELETE",
        entityType: "ABSENCE_TAG",
        entityLabel: absenceTag.label,
      },
    });

    return NextResponse.json(absenceTag);
  } catch (error) {
    console.log("[DELETE_ABSENCE_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
