import { NextResponse } from "next/server";
import { storageStatus } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 保存先の診断。秘密情報は返さない。
 * persistent: true なら Upstash Redis に永続保存されている（電源/再起動で消えない）。
 * persistent: false なら一時メモリ保存（リセットの危険）→ Vercelの環境変数を要確認。
 */
export async function GET() {
  const storage = await storageStatus();
  const lineChannelConfigured = Boolean(process.env.LINE_CHANNEL_ID);
  return NextResponse.json({
    ...storage,
    lineChannelConfigured,
  });
}
