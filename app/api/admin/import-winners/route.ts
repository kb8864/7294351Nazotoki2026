import { NextResponse } from "next/server";
import { importWinner, listWinners } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 過去の全問正解者を手動で取り込む（管理用）。?key=<ADMIN_KEY> で保護。
 *
 * body 例:
 * {
 *   "winners": [
 *     { "name": "七福太郎", "clearedAt": 1750000000000 },
 *     { "name": "七福花子", "time": "2026-06-25T21:15:00+09:00" }
 *   ]
 * }
 *
 * clearedAt(epoch ms) があれば優先。無ければ time を Date.parse。
 * 既存と同じ name+clearedAt は重複せず上書きされる。
 */
export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const key = new URL(req.url).searchParams.get("key");
  if (!adminKey || key !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { winners?: Array<{ name?: string; clearedAt?: number; time?: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const list = Array.isArray(body.winners) ? body.winners : [];
  if (list.length === 0) {
    return NextResponse.json({ error: "no winners provided" }, { status: 400 });
  }

  const errors: string[] = [];
  let imported = 0;

  for (let i = 0; i < list.length; i++) {
    const w = list[i];
    const name = (w.name ?? "").toString().trim();
    if (!name) {
      errors.push(`#${i}: name is empty`);
      continue;
    }
    let clearedAt: number | null = null;
    if (typeof w.clearedAt === "number" && Number.isFinite(w.clearedAt)) {
      clearedAt = w.clearedAt;
    } else if (w.time) {
      const t = Date.parse(w.time);
      if (!Number.isNaN(t)) clearedAt = t;
    }
    if (clearedAt == null) {
      errors.push(`#${i} (${name}): invalid clearedAt/time`);
      continue;
    }
    await importWinner(name, clearedAt);
    imported++;
  }

  const winners = await listWinners();
  return NextResponse.json({ imported, errors, winnersCount: winners.length, winners });
}
