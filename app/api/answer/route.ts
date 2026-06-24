import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreatePlayer, savePlayer, recordAnswer } from "@/lib/db";
import { isCorrectAnswer } from "@/lib/answers.server";
import { getPuzzleMeta, MAIN_COUNT, BONUS_COUNT } from "@/lib/puzzles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { puzzleId?: number; answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const puzzleId = Number(body.puzzleId);
  const answer = (body.answer ?? "").toString();
  const meta = getPuzzleMeta(puzzleId);
  if (!meta) {
    return NextResponse.json({ error: "unknown puzzle" }, { status: 400 });
  }

  const progress = await getOrCreatePlayer(user.userId, user.displayName);

  // おまけ謎はメインクリア後のみ
  if (meta.group === "bonus" && !progress.mainCleared) {
    return NextResponse.json({ correct: false, progress });
  }

  const correct = isCorrectAnswer(puzzleId, answer);

  if (correct) {
    // 進捗を前進させる（期待される次の問題のときだけカウント加算）
    if (meta.group === "main") {
      if (meta.order === progress.mainSolved + 1) {
        progress.mainSolved += 1;
        if (progress.mainSolved >= MAIN_COUNT) progress.mainCleared = true;
      }
    } else {
      if (meta.order === progress.bonusSolved + 1) {
        progress.bonusSolved += 1;
        if (progress.bonusSolved >= BONUS_COUNT) progress.bonusCleared = true;
      }
    }
    recordAnswer(progress, {
      puzzleId,
      label: meta.label,
      answer: answer.trim(),
      at: Date.now(),
    });
    await savePlayer(user.userId, progress);
  }

  return NextResponse.json({ correct, progress });
}
