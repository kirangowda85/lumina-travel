import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Deliberately unauthenticated and lightweight — meant for uptime monitors
// and the hosting platform's health probe, not for humans. Confirms the
// process is up AND the database is reachable, since "the Next.js server
// responds" alone doesn't tell you booking/auth flows will actually work.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "ok" });
  } catch (err) {
    console.error("Health check: database unreachable", err);
    return NextResponse.json({ status: "error", db: "unreachable" }, { status: 503 });
  }
}
