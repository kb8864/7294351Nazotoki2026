import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreatePlayer, savePlayer, registerWinner } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim().slice(0, 30);
  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const progress = await getOrCreatePlayer(user.userId, user.displayName);
  if (!progress.bonusCleared) {
    return NextResponse.json({ error: "not cleared yet" }, { status: 403 });
  }

  progress.registeredName = name;
  await savePlayer(user.userId, progress);
  await registerWinner(user.userId, name);

  return NextResponse.json({ ok: true, progress });
}
