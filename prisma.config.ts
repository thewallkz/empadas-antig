// Used by the Prisma CLI (migrations, db push, studio).
// Runtime queries use DATABASE_URL passed directly in lib/prisma.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL is the non-pooled connection string required by Prisma CLI.
    // Supabase pooler (port 6543) does not support the session mode that
    // migrations need, so we use the direct connection (port 5432) here.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
