import { NextResponse } from "next/server";
import { storageStatus, listWinners, countPlayers } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 管理用の集計（読み取り専用）。?key=<ADMIN_KEY> で保護。
 * 保存先の状態・全問正解者数・登録プレイヤー数・正解者一覧を返す。
 * 例: /api/admin/stats?key=xxxx
 */
export async function GET(req: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const key = new URL(req.url).searchParams.get("key");
  if (!adminKey || key !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const storage = await storageStatus();
  const winners = await listWinners();
  const playersCount = await countPlayers();

  return NextResponse.json({
    storage,
    winnersCount: winners.length,
    playersCount,
    winners,
  });
}
