"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { fetchWinners } from "@/lib/api";
import { LiffSession } from "@/lib/liff";
import { WinnerEntry } from "@/lib/types";

/** 全問正解者の一覧（名前＋クリア日時、クリア順） */
export default function WinnersModal({
  open,
  session,
  onClose,
}: {
  open: boolean;
  session: LiffSession | null;
  onClose: () => void;
}) {
  const [winners, setWinners] = useState<WinnerEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !session) return;
    setWinners(null);
    setError(null);
    fetchWinners(session)
      .then(setWinners)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "取得に失敗しました")
      );
  }, [open, session]);

  const fmt = (t: number) =>
    new Date(t).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Modal open={open} title="全問正解者" onClose={onClose}>
      {error ? (
        <p className="text-center text-[var(--color-vermilion)]">{error}</p>
      ) : winners === null ? (
        <p className="text-center text-[var(--color-ink)]/50">読み込み中…</p>
      ) : winners.length === 0 ? (
        <p className="text-center text-[var(--color-ink)]/50">
          まだ全問正解者がいません。一番乗りを目指しましょう！
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {winners.map((w, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5"
            >
              <span className="w-7 shrink-0 text-center text-sm font-bold text-[var(--color-ink)]/50">
                {i + 1}
              </span>
              <span className="flex-1 break-all text-base font-bold">
                {w.name}
              </span>
              <span className="shrink-0 text-xs text-[var(--color-ink)]/50">
                {fmt(w.clearedAt)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
