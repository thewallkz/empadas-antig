import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  ProductImageError,
  deleteProductImage,
  uploadProductImage,
} from "@/lib/product-images";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { available } = body;

    if (typeof available !== "boolean") {
      return NextResponse.json(
        { error: "Available status is required" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { available },
    });

    revalidatePath("/");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let nextImageUrl: string | null = null;

  try {
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const { id } = await params;
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || null;
    const priceStr = formData.get("price")?.toString() || "";
    const available = formData.get("available")?.toString() === "true";
    const file = formData.get("image");

    if (!name || !priceStr) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    if (file instanceof File && file.size > 0) {
      nextImageUrl = await uploadProductImage(file);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        available,
        imageUrl: nextImageUrl ?? existingProduct.imageUrl,
      },
    });

    if (nextImageUrl && existingProduct.imageUrl) {
      await deleteProductImage(existingProduct.imageUrl);
    }

    revalidatePath("/");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (nextImageUrl) {
      await deleteProductImage(nextImageUrl);
    }

    console.error("PATCH Product Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update product";
    const status = error instanceof ProductImageError ? error.status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminSession();

    if (!authResult.authorized) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const product = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    await prisma.product.delete({
      where: { id },
    });

    await deleteProductImage(product?.imageUrl);

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
