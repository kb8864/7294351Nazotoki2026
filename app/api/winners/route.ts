import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { listWinners } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // ログインユーザーのみ閲覧可（横断データなので認証は必須）
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const winners = await listWinners();
  return NextResponse.json({ winners });
}
