import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientContact, paymentMethod, items } = body;

    if (!clientName || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate total securely on backend
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products not found" }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItemsData = items.map((item: any) => {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) throw new Error("Product mismatch");

      const unitPrice = dbProduct.price;
      const quantity = Math.max(1, item.quantity);
      totalAmount += unitPrice * quantity;

      return {
        productId: item.productId,
        quantity,
        unitPrice,
      };
    });

    // Save order
    const newOrder = await prisma.order.create({
      data: {
        clientName,
        clientContact,
        paymentMethod,
        totalAmount,
        status: "ABERTO",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
