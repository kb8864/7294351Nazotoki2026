"use client";

import Modal from "@/components/ui/Modal";
import { PlayerProgress } from "@/lib/types";

/** 自分が正解した問題と入力した答えの一覧（本人のみ） */
export default function AnsweredListModal({
  open,
  progress,
  onClose,
}: {
  open: boolean;
  progress: PlayerProgress | null;
  onClose: () => void;
}) {
  const answered = progress?.answered ?? [];
  return (
    <Modal open={open} title="回答した問題と答え" onClose={onClose}>
      {answered.length === 0 ? (
        <p className="text-center text-[var(--color-ink)]/50">
          まだ正解した問題がありません。
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {[...answered]
            .sort((a, b) => a.puzzleId - b.puzzleId)
            .map((a) => (
              <li
                key={a.puzzleId}
                className="flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5"
              >
                <span className="w-20 shrink-0 rounded-md bg-[var(--color-ink)]/10 px-2 py-1 text-center text-sm font-bold">
                  {a.label}
                </span>
                <span className="flex-1 break-all text-base font-bold text-[var(--color-accent)]">
                  {a.answer}
                </span>
              </li>
            ))}
        </ul>
      )}
    </Modal>
  );
}
