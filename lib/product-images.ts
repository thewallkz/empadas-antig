import crypto from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";

const MAX_PRODUCT_IMAGE_SIZE = 2 * 1024 * 1024;
type ProductImageType = "image/jpeg" | "image/png" | "image/webp";

const PRODUCT_IMAGE_EXTENSIONS: Record<ProductImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type SupabaseStorageConfig = {
  apiKey: string;
  bucket: string;
  url: string;
};

export class ProductImageError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = "ProductImageError";
  }
}

function getSupabaseStorageConfig(): SupabaseStorageConfig | null {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const apiKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";

  if (!url || !apiKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    apiKey,
    bucket: process.env.SUPABASE_STORAGE_BUCKET?.trim() || "product-images",
  };
}

function detectImageType(bytes: Uint8Array): ProductImageType | null {
  if (
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

function encodeStoragePath(pathname: string) {
  return pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function decodeStoragePath(pathname: string) {
  return pathname
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

function getSafeBaseName(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "produto";
}

async function parseProductImage(file: File) {
  if (file.size <= 0) {
    throw new ProductImageError("The selected image is empty.");
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new ProductImageError("The product image must be 2MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detectedType = detectImageType(bytes);

  if (!detectedType) {
    throw new ProductImageError("Only JPEG, PNG, and WebP images are allowed.");
  }

  if (file.type && file.type !== detectedType) {
    throw new ProductImageError(
      "The uploaded file type does not match its contents."
    );
  }

  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: detectedType,
    extension: PRODUCT_IMAGE_EXTENSIONS[detectedType],
  };
}

export async function uploadProductImage(file: File) {
  const parsedImage = await parseProductImage(file);
  const fileBaseName = getSafeBaseName(file.name);
  const objectName = `${Date.now()}-${crypto.randomUUID()}-${fileBaseName}.${parsedImage.extension}`;
  const storageConfig = getSupabaseStorageConfig();

  if (storageConfig) {
    const storagePath = `products/${objectName}`;
    const response = await fetch(
      `${storageConfig.url}/storage/v1/object/${encodeURIComponent(storageConfig.bucket)}/${encodeStoragePath(storagePath)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storageConfig.apiKey}`,
          apikey: storageConfig.apiKey,
          "Content-Type": parsedImage.contentType,
          "x-upsert": "false",
        },
        body: parsedImage.buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new ProductImageError(
        errorText || "Supabase Storage rejected the image upload.",
        500
      );
    }

    return `${storageConfig.url}/storage/v1/object/public/${storageConfig.bucket}/${encodeStoragePath(storagePath)}`;
  }

  if (process.env.NODE_ENV === "production") {
    throw new ProductImageError(
      "Configure Supabase Storage in production before uploading product images.",
      500
    );
  }

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const localFilename = `${Date.now()}-${crypto.randomUUID()}-${fileBaseName}.${parsedImage.extension}`;
  await writeFile(join(uploadsDir, localFilename), parsedImage.buffer);

  return `/uploads/${localFilename}`;
}

export async function deleteProductImage(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return;
  }

  if (imageUrl.startsWith("/uploads/")) {
    const relativePath = imageUrl.replace(/^\//, "").split("/");
    await unlink(join(process.cwd(), "public", ...relativePath)).catch(() => {
      return undefined;
    });
    return;
  }

  const storageConfig = getSupabaseStorageConfig();

  if (!storageConfig) {
    return;
  }

  const publicPrefix = `${storageConfig.url}/storage/v1/object/public/${storageConfig.bucket}/`;

  if (!imageUrl.startsWith(publicPrefix)) {
    return;
  }

  const storagePath = decodeStoragePath(imageUrl.slice(publicPrefix.length));

  const response = await fetch(
    `${storageConfig.url}/storage/v1/object/${encodeURIComponent(storageConfig.bucket)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storageConfig.apiKey}`,
        apikey: storageConfig.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [storagePath] }),
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    console.error("Failed to delete product image:", errorText);
  }
}
