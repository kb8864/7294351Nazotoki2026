"use client";

import { LiffSession } from "./liff";
import { PlayerProgress, WinnerEntry } from "./types";

function authHeaders(session: LiffSession): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (session.idToken) {
    h["Authorization"] = `Bearer ${session.idToken}`;
  } else if (session.mock) {
    // 開発用（本番ビルドではサーバー側が無視する）
    h["x-dev-user"] = "local";
  }
  return h;
}

export async function fetchProgress(
  session: LiffSession
): Promise<PlayerProgress> {
  const res = await fetch("/api/progress", { headers: authHeaders(session) });
  if (!res.ok) throw new Error("進捗の取得に失敗しました");
  const data = await res.json();
  return data.progress as PlayerProgress;
}

export async function submitAnswer(
  session: LiffSession,
  puzzleId: number,
  answer: string
): Promise<{ correct: boolean; progress: PlayerProgress }> {
  const res = await fetch("/api/answer", {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({ puzzleId, answer }),
  });
  if (!res.ok) throw new Error("送信に失敗しました");
  return res.json();
}

export async function registerName(
  session: LiffSession,
  name: string
): Promise<PlayerProgress> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("登録に失敗しました");
  const data = await res.json();
  return data.progress as PlayerProgress;
}

export async function fetchWinners(
  session: LiffSession
): Promise<WinnerEntry[]> {
  const res = await fetch("/api/winners", { headers: authHeaders(session) });
  if (!res.ok) throw new Error("正解者の取得に失敗しました");
  const data = await res.json();
  return data.winners as WinnerEntry[];
}
