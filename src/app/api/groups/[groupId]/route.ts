import { db } from "@/shared/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const group = await db.group.delete({
      where: {
        id: params.groupId,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[DELETE_GROUP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
