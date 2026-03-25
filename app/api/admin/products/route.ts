import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export async function GET() {
  try {
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
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const file = formData.get("image") as File | null;
    const availableStr = formData.get("available") as string | null;

    if (!name || !priceStr) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const price = parseFloat(priceStr);
    const available = availableStr !== "false"; 

    let imageUrl = null;

    if (file && file.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const ext = file.name.split(".").pop();
      const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${ext}`;
      const filePath = join(uploadDir, uniqueName);

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${uniqueName}`;
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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
