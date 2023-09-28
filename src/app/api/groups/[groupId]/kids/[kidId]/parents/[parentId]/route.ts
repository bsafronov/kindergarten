import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import clsx from "clsx";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { kidId: string; parentId: string } }
) {
  try {
    const { userId } = auth();
    const { parentId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parent = await db.parent.update({
      where: {
        id: parentId,
      },
      data: {
        updatedBy: userId,

        // FROM FRONTEND
        kidIDs: values.kidIDs,
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        role: values.role,
      },
    });

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: parent.groupId,
        actionType: "UPDATE",
        entityType: "PARENT",
        entityId: parent.id,
      },
    });

    return NextResponse.json(parent);
  } catch (error) {
    console.log("[UPDATE_PARENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { parentId: string } }
) {
  try {
    const { userId } = auth();
    const { parentId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parent = await db.parent.delete({
      where: {
        id: parentId,
      },
    });

    const fio = clsx([
      parent.lastName,
      parent.firstName && `${parent.firstName[0]}.`,
      parent.middleName && `${parent.middleName[0]}.`,
    ]);

    await db.log.create({
      data: {
        createdBy: userId,
        groupId: parent.groupId,
        actionType: "DELETE",
        entityType: "PARENT",
        entityLabel: fio,
      },
    });

    return NextResponse.json(parent);
  } catch (error) {
    console.log("[DELETE_PARENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
