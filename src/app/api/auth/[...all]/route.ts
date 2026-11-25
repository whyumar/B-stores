import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

function authUnavailable() {
  return NextResponse.json(
    { message: "Account sign-in is temporarily unavailable. Guest checkout is still available." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return authUnavailable();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return databaseUnavailable();
  return handlers.POST(request);
}
