import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { vaccinationTagId: string } }
) {
  try {
    const { userId } = auth();
    const { vaccinationTagId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vaccinationLabel = await db.vaccinationTag.update({
      where: {
        id: vaccinationTagId,
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
        groupId: vaccinationLabel.groupId,
        entityType: "VACCINATION_TAG",
        actionType: "UPDATE",
        entityId: vaccinationLabel.id,
      },
    });

    return NextResponse.json(vaccinationLabel);
  } catch (error) {
    console.log("[UPDATE_VACCINATION_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vaccinationTagId: string } }
) {
  try {
    const { userId } = auth();
    const { vaccinationTagId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vaccinationTag = await db.vaccinationTag.delete({
      where: {
        id: vaccinationTagId,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: vaccinationTag.groupId,
        entityType: "VACCINATION_TAG",
        actionType: "DELETE",
        entityLabel: vaccinationTag.label,
      },
    });

    return NextResponse.json(vaccinationTag);
  } catch (error) {
    console.log("[DELETE_VACCINATION_TAG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
