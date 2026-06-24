"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PuzzleMeta, PlayerProgress } from "@/lib/types";
import { LiffSession } from "@/lib/liff";
import HamburgerMenu from "@/components/menu/HamburgerMenu";
import HintButtons from "@/components/ui/HintButtons";
import SaveableImage from "@/components/ui/SaveableImage";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function PuzzleScreen({
  puzzle,
  session,
  progress,
  submitting,
  onSubmit,
}: {
  puzzle: PuzzleMeta;
  session: LiffSession | null;
  progress: PlayerProgress | null;
  submitting: boolean;
  onSubmit: (answer: string) => void;
}) {
  const [value, setValue] = useState("");
  const canSubmit = value.trim().length > 0 && !submitting;

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col bg-washi"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      {/* 右上ハンバーガー */}
      <HamburgerMenu session={session} progress={progress} />

      {/* 問題画像（全幅・大きめ・保存可能） */}
      <div className="px-2 pt-14">
        <SaveableImage
          src={puzzle.image}
          alt={`${puzzle.label}の問題`}
          imgClassName="max-h-[56vh]"
        />
      </div>

      {/* ヒントボタン（画像の下に横並び） */}
      {puzzle.hints.length > 0 && (
        <div className="mt-3 px-4">
          <HintButtons hints={puzzle.hints} />
        </div>
      )}

      {/* 回答エリア（ヒントの直後に詰める） */}
      <div className="mt-4 flex flex-col gap-2 px-5 pb-8">
        <div className="flex items-baseline gap-3">
          <span className="rounded-md bg-[var(--color-ink)]/10 px-3 py-1 text-sm font-bold">
            回答入力欄
          </span>
          <span className="text-xs font-bold text-[var(--color-ink)]/50">
            {puzzle.label}
          </span>
        </div>

        {puzzle.showNumberNotice && (
          <p className="text-sm font-bold text-[var(--color-vermilion)]">
            回答時、問題番号を頭につけてください
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) onSubmit(value);
            }}
            placeholder="ここに回答を入力"
            className="min-w-0 flex-1 rounded-xl border-2 border-[var(--color-ink)]/20 bg-white px-4 py-3 text-lg outline-none focus:border-[var(--color-accent)]"
          />
          <PrimaryButton
            onClick={() => onSubmit(value)}
            disabled={!canSubmit}
            className="shrink-0 px-5 py-3 text-base"
          >
            {submitting ? "…" : "回答送信"}
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}
