import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreatePlayer } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const progress = await getOrCreatePlayer(user.userId, user.displayName);
  return NextResponse.json({ progress });
}
