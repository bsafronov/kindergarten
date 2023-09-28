import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { kidId: string; vaccinationId: string } }
) {
  try {
    const { userId } = auth();
    const { vaccinationId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vaccination = await db.vaccination.update({
      where: {
        id: vaccinationId,
      },
      data: {
        updatedBy: userId,

        // FROM FRONTEND
        date: values.date,
        tagId: values.tagId,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: vaccination.groupId,
        actionType: "UPDATE",
        entityType: "VACCINATION",
        entityId: vaccination.id,
      },
    });

    return NextResponse.json(vaccination);
  } catch (error) {
    console.log("[UPDATE_VACCINATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vaccinationId: string } }
) {
  try {
    const { userId } = auth();
    const { vaccinationId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vaccination = await db.vaccination.delete({
      where: {
        id: vaccinationId,
      },
      include: {
        kid: true,
      },
    });

    const kid = vaccination.kid;
    const fio = `${kid.lastName} ${kid.firstName[0]}. ${kid.middleName[0]}.`;

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: vaccination.groupId,
        actionType: "DELETE",
        entityType: "VACCINATION",
        entityLabel: fio,
      },
    });

    return NextResponse.json(vaccination);
  } catch (error) {
    console.log("[DELETE_VACCINATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
