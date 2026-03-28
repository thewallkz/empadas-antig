import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await request.json();

    if (!status || !["ABERTO", "CONFIRMADO", "CANCELADO"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PATCH Order Status Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
