import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type OrderRequestItem = {
  productId: string;
  quantity: number;
};

type OrderRequestBody = {
  clientContact?: string | null;
  clientName?: string;
  items?: OrderRequestItem[];
  paymentMethod?: "PAGAR_AGORA" | "PAGAR_NA_RETIRADA";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const { clientName, clientContact, paymentMethod, items } = body;

    if (
      !clientName ||
      !paymentMethod ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["PAGAR_AGORA", "PAGAR_NA_RETIRADA"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Calculate total securely on backend
    const productIds = items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products not found" }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) throw new Error("Product mismatch");

      const unitPrice = dbProduct.price;
      const quantity = Math.max(1, Number(item.quantity) || 1);
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
