import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { kidId: string; absenceId: string } }
) {
  try {
    const { userId } = auth();
    const { absenceId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const absence = await db.absence.update({
      where: {
        id: absenceId,
      },
      data: {
        updatedBy: userId,

        // FROM FRONTEND
        date: values.date,
        reason: values.reason,
        tagIDs: values.tagIDs,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: absence.groupId,
        actionType: "UPDATE",
        entityType: "ABSENCE",
        entityId: absence.id,
      },
    });

    return NextResponse.json(absence);
  } catch (error) {
    console.log("[UPDATE_ABSENCE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { absenceId: string } }
) {
  try {
    const { userId } = auth();
    const { absenceId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const absence = await db.absence.delete({
      where: {
        id: absenceId,
      },
      include: {
        kid: true,
      },
    });

    const kid = absence.kid;
    const fio = `${kid.lastName} ${kid.firstName[0]}. ${kid.middleName[0]}.`;

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: absence.groupId,
        actionType: "DELETE",
        entityType: "ABSENCE",
        entityLabel: `${kid.id}:${fio}, ${absence.date}`,
      },
    });

    return NextResponse.json(absence);
  } catch (error) {
    console.log("[DELETE_ABSENCE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
