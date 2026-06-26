"use client";

import { motion } from "framer-motion";

/**
 * トップページ。背景画像のカード位置にボタンを重ねる。
 * 左「合宿謎解き」は常時アクティブで強調（立体・脈動）。
 * 右「おまけ謎」はメインクリア後（bonusUnlocked）に解放され立体的に強調。
 */
export default function TopScreen({
  bonusUnlocked,
  onStartMain,
  onTapBonus,
}: {
  bonusUnlocked: boolean;
  onStartMain: () => void;
  onTapBonus: () => void;
}) {
  const bg = bonusUnlocked
    ? "/images/top-bg-unlocked.png"
    : "/images/top-bg.png";

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-washi bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})`, backgroundColor: "var(--color-washi)" }}
    >
      {/* アスペクト比維持のスペーサー（縦長画像 約9:16） */}
      <div className="pointer-events-none w-full" style={{ paddingTop: "177%" }} />

      {/* 合宿謎解き（左・強調） */}
      <motion.button
        aria-label="合宿謎解きを始める"
        onClick={onStartMain}
        className="absolute left-[5%] top-[38.5%] h-[25%] w-[43%] rounded-3xl"
        style={{ transformOrigin: "center" }}
        whileTap={{ scale: 0.92 }}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 6px 14px rgba(34,139,34,0.0)",
            "0 14px 28px rgba(34,139,34,0.55)",
            "0 6px 14px rgba(34,139,34,0.0)",
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* 脈動する強調リング */}
        <motion.span
          className="absolute inset-0 rounded-3xl border-4 border-green-400"
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ここをタップ！
        </motion.span>
      </motion.button>

      {/* おまけ謎（右・解放後のみ） */}
      <motion.button
        aria-label="おまけ謎を始める"
        onClick={bonusUnlocked ? onTapBonus : undefined}
        disabled={!bonusUnlocked}
        className="absolute right-[5%] top-[38.5%] h-[25%] w-[43%] rounded-3xl disabled:cursor-not-allowed"
        whileTap={bonusUnlocked ? { scale: 0.92 } : undefined}
        animate={
          bonusUnlocked
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 6px 14px rgba(234,88,12,0.0)",
                  "0 14px 28px rgba(234,88,12,0.55)",
                  "0 6px 14px rgba(234,88,12,0.0)",
                ],
              }
            : undefined
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {bonusUnlocked && (
          <motion.span
            className="absolute inset-0 rounded-3xl border-4 border-orange-400"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </div>
  );
}
