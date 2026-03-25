import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type AdminAuthResult =
  | { authorized: true; session: Session }
  | { authorized: false; response: NextResponse };

export async function requireAdminSession(): Promise<AdminAuthResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    authorized: true,
    session,
  };
}
