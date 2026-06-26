"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PuzzleMeta } from "@/lib/types";
import { LiffSession } from "@/lib/liff";
import { submitAnswer } from "@/lib/api";
import { celebrate } from "@/lib/confetti";
import HintButtons from "@/components/ui/HintButtons";
import SaveableImage from "@/components/ui/SaveableImage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * 復習モード。既出の問題をもう一度挑戦できる（進捗・遷移には影響しない）。
 * 答え合わせをして、正解なら紙吹雪、不正解ならその場で表示するだけ。
 */
export default function PracticeScreen({
  puzzle,
  session,
  onExit,
}: {
  puzzle: PuzzleMeta;
  session: LiffSession | null;
  onExit: () => void;
}) {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<null | "correct" | "wrong">(null);
  const [shakeKey, setShakeKey] = useState(0);
  const canSubmit = value.trim().length > 0 && !checking;

  const check = async () => {
    if (!session || !canSubmit) return;
    setChecking(true);
    try {
      const { correct } = await submitAnswer(session, puzzle.id, value);
      if (correct) {
        celebrate("correct");
        setResult("correct");
      } else {
        setResult("wrong");
        setShakeKey((k) => k + 1); // シェイクを再生
      }
    } catch {
      setResult(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col bg-washi"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* ヘッダ：復習モード表示＋戻る */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-sm font-bold text-[var(--color-accent)]">
          復習モード（{puzzle.label}）
        </span>
        <motion.button
          onClick={onExit}
          whileTap={{ scale: 0.92 }}
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow active:bg-black/5"
        >
          ← 戻る
        </motion.button>
      </div>

      {/* 問題画像 */}
      <motion.div className="px-2 pt-2" variants={staggerItem}>
        <SaveableImage
          src={puzzle.image}
          alt={`${puzzle.label}の問題`}
          imgClassName="max-h-[52vh]"
        />
      </motion.div>

      {/* ヒント */}
      {puzzle.hints.length > 0 && (
        <motion.div className="mt-3 px-4" variants={staggerItem}>
          <HintButtons hints={puzzle.hints} />
        </motion.div>
      )}

      {/* 回答エリア */}
      <motion.div
        className="mt-4 flex flex-col gap-2 px-5 pb-8"
        variants={staggerItem}
      >
        {puzzle.showNumberNotice && (
          <p className="text-sm font-bold text-[var(--color-vermilion)]">
            回答時、問題番号を頭につけてください
          </p>
        )}

        <motion.div
          key={shakeKey}
          animate={
            result === "wrong" ? { x: [0, -12, 10, -6, 4, 0] } : { x: 0 }
          }
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            inputMode="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) check();
            }}
            placeholder="ここに回答を入力"
            className="min-w-0 flex-1 rounded-xl border-2 border-[var(--color-ink)]/20 bg-white px-4 py-3 text-lg outline-none focus:border-[var(--color-accent)]"
          />
          <PrimaryButton
            onClick={check}
            disabled={!canSubmit}
            className="shrink-0 px-5 py-3 text-base"
          >
            {checking ? "…" : "答え合わせ"}
          </PrimaryButton>
        </motion.div>

        {result === "correct" && (
          <p className="text-center text-base font-bold text-[var(--color-accent)]">
            正解！🎉
          </p>
        )}
        {result === "wrong" && (
          <p className="text-center text-base font-bold text-[var(--color-vermilion)]">
            不正解です。もう一度！
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
