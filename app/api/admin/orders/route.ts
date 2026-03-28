import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prisma = getPrisma();
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, imageUrl: true }
            }
          }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET Admin Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
