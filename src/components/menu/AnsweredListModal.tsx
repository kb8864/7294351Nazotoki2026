"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { PlayerProgress } from "@/lib/types";
import { getPuzzleMeta } from "@/lib/puzzles";

/**
 * 自分が正解した問題の一覧（本人のみ）。
 * 各問題は画像を表示し、「答えを見る」で答えを表示/非表示、
 * 「もう一度挑戦」で復習モードに入れる。
 */
export default function AnsweredListModal({
  open,
  progress,
  onClose,
  onChallenge,
}: {
  open: boolean;
  progress: PlayerProgress | null;
  onClose: () => void;
  onChallenge: (puzzleId: number) => void;
}) {
  const answered = progress?.answered ?? [];
  const [revealed, setRevealed] = useState<number[]>([]);

  const toggle = (id: number) =>
    setRevealed((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

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
              const isOpen = revealed.includes(a.puzzleId);
              return (
                <li
                  key={a.puzzleId}
                  className="flex flex-col gap-2 rounded-xl bg-white/80 p-3"
                >
                  {/* ラベル */}
                  <span className="self-start rounded-md bg-[var(--color-ink)]/10 px-2 py-1 text-sm font-bold">
                    {a.label}
                  </span>

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

                  {/* 答え（「答えを見る」で表示/非表示） */}
                  {isOpen && (
                    <div className="rounded-lg bg-[var(--color-accent)]/10 px-3 py-2">
                      <span className="text-xs font-bold text-[var(--color-ink)]/50">
                        あなたの答え：
                      </span>
                      <span className="ml-1 break-all text-base font-bold text-[var(--color-accent)]">
                        {a.answer}
                      </span>
                    </div>
                  )}

                  {/* 操作ボタン */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggle(a.puzzleId)}
                      className="flex-1 rounded-lg border-2 border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm font-bold text-[var(--color-ink)] active:bg-black/5"
                    >
                      {isOpen ? "答えを隠す" : "答えを見る"}
                    </button>
                    <button
                      onClick={() => onChallenge(a.puzzleId)}
                      className="flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-bold text-white shadow active:opacity-90"
                    >
                      もう一度挑戦
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </Modal>
  );
}
