"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

/** 不正解画面。「閉じる」で直前の問題へ戻る。 */
export default function IncorrectScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-washi"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 赤フラッシュ */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[var(--color-vermilion)]"
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* 画像を横シェイクで強調 */}
      <motion.div
        className="flex flex-1 items-center justify-center p-5"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1, x: [0, -14, 12, -8, 6, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 14 },
          x: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/incorrect.png"
          alt="不正解です"
          className="max-h-full max-w-full rounded-xl object-contain shadow"
        />
      </motion.div>
      <div className="w-full px-8 pb-12">
        <PrimaryButton className="w-full" onClick={onClose}>
          閉じる
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
