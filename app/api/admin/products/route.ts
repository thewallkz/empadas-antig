import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { ProductImageError, uploadProductImage } from "@/lib/product-images";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prisma = getPrisma();
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || null;
    const priceStr = formData.get("price")?.toString() || "";
    const file = formData.get("image") as File | null;
    const availableStr = formData.get("available")?.toString() || "";

    if (!name || !priceStr) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const price = parseFloat(priceStr);
    const available = availableStr === "true";

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Price must be a valid positive number" }, { status: 400 });
    }

    let imageUrl = null;

    if (file && file.size > 0) {
      imageUrl = await uploadProductImage(file);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        available,
      },
    });

    revalidatePath("/");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    const status = error instanceof ProductImageError ? error.status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
