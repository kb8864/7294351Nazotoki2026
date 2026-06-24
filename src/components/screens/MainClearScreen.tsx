"use client";

import { motion } from "framer-motion";
import SaveableImage from "@/components/ui/SaveableImage";
import PrimaryButton from "@/components/ui/PrimaryButton";

/** 合宿謎クリア画面（保存可能）。トップへ戻るとおまけ謎が解放される。 */
export default function MainClearScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col bg-washi"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="flex flex-1 items-center justify-center p-4">
        <SaveableImage src="/images/main-clear.png" alt="合宿謎クリア" />
      </div>
      <div className="px-6 pb-10">
        <PrimaryButton className="w-full" onClick={onNext}>
          トップへ戻る（おまけ謎が解放されます）
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
