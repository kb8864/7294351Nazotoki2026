"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

/** 不正解画面。「閉じる」で直前の問題へ戻る。 */
export default function IncorrectScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-washi"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex flex-1 items-center justify-center p-5"
        initial={{ scale: 0.8, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 14 }}
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
