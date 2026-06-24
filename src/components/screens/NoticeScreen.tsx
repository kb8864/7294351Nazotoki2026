"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

/** 謎解き注意事項。右下「次へ」で謎解き開始。 */
export default function NoticeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col bg-washi"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-1 items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/intro.png"
          alt="謎解き注意事項"
          className="max-h-full max-w-full rounded-xl object-contain shadow"
        />
      </div>
      <div className="flex justify-end px-6 pb-8">
        <PrimaryButton onClick={onNext} className="px-10">
          次へ ▶
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
