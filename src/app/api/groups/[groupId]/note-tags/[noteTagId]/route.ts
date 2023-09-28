import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { noteTagId: string } }
) {
  try {
    const { userId } = auth();
    const { noteTagId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const noteTag = await db.noteTag.update({
      where: {
        id: noteTagId,
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
        groupId: noteTag.groupId,
        entityType: "NOTE_TAG",
        actionType: "UPDATE",
        entityId: noteTag.id,
      },
    });

    return NextResponse.json(noteTag);
  } catch (error) {
    console.log("[UPDATE_NOTE_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { noteTagId: string } }
) {
  try {
    const { userId } = auth();
    const { noteTagId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const noteTag = await db.noteTag.delete({
      where: {
        id: noteTagId,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: noteTag.groupId,
        entityType: "NOTE_TAG",
        actionType: "DELETE",
        entityLabel: noteTag.label,
      },
    });

    return NextResponse.json(noteTag);
  } catch (error) {
    console.log("[DELETE_NOTE_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
