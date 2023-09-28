import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { kidId: string; noteId: string } }
) {
  try {
    const { userId } = auth();
    const { noteId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.update({
      where: {
        id: noteId,
      },
      data: {
        updatedBy: userId,

        // FROM FRONTEND
        description: values.description,
        tagIDs: values.tagIDs,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: note.groupId,
        actionType: "UPDATE",
        entityType: "NOTE",
        entityId: note.id,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[UPDATED_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();
    const { noteId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.delete({
      where: {
        id: noteId,
      },
      include: {
        kid: true,
      },
    });

    const kid = note.kid;
    const fio = `${kid.lastName} ${kid.firstName[0]}. ${kid.middleName[0]}.`;

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: note.groupId,
        actionType: "DELETE",
        entityType: "NOTE",
        entityLabel: `${kid.id}:${fio}, ${note.description}`,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[DELETE_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
