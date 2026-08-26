// app/api/health/route.ts
import { db } from "@/lib/db";

export async function GET() {
  const { error, data } = await db.from("commits").select("*");
  return Response.json({ ok: !error, error: error?.message, data });
}