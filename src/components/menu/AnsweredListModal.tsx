"use client";

import Modal from "@/components/ui/Modal";
import { PlayerProgress } from "@/lib/types";
import { getPuzzleMeta } from "@/lib/puzzles";

/** 自分が正解した問題（画像）と入力した答えの一覧（本人のみ） */
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
        <ul className="flex flex-col gap-4">
          {[...answered]
            .sort((a, b) => a.puzzleId - b.puzzleId)
            .map((a) => {
              const meta = getPuzzleMeta(a.puzzleId);
              return (
                <li
                  key={a.puzzleId}
                  className="flex flex-col gap-2 rounded-xl bg-white/80 p-3"
                >
                  {/* 問題ラベルと答え */}
                  <div className="flex items-center gap-3">
                    <span className="w-20 shrink-0 rounded-md bg-[var(--color-ink)]/10 px-2 py-1 text-center text-sm font-bold">
                      {a.label}
                    </span>
                    <span className="flex-1 break-all text-base font-bold text-[var(--color-accent)]">
                      {a.answer}
                    </span>
                  </div>
                  {/* 問題画像 */}
                  {meta && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={meta.image}
                      alt={`${a.label}の問題`}
                      draggable={false}
                      className="w-full rounded-lg object-contain"
                    />
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </Modal>
  );
}
