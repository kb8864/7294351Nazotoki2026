"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import PrimaryButton from "./PrimaryButton";

/** 共通ポップアップ。閉じるボタン付き。リッチに出入りする。 */
export default function Modal({
  open,
  title,
  children,
  onClose,
  closeLabel = "閉じる",
}: {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  closeLabel?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="relative z-10 flex max-h-[80dvh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-washi shadow-2xl"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {title && (
              <h2 className="border-b border-black/10 px-5 py-3 text-center text-lg font-bold">
                {title}
              </h2>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            <div className="border-t border-black/10 p-3">
              <PrimaryButton className="w-full" onClick={onClose}>
                {closeLabel}
              </PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
