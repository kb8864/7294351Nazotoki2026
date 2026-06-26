"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 正解時の全画面演出。「正解！」バッジがスプリングでポップし、
 * 背後で2重のリング波紋が広がる。紙吹雪（confetti）と同時に表示される。
 */
export default function CorrectOverlay({ open }: { open: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* リング波紋 */}
          {[0, 0.15].map((delay, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border-4 border-[var(--color-vermilion)]"
              style={{ width: 160, height: 160 }}
              initial={{ scale: 0.4, opacity: 0.7 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay }}
            />
          ))}

          {/* 正解！バッジ */}
          <motion.div
            initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 12 }}
            className="rounded-3xl bg-white/95 px-10 py-6 shadow-2xl"
          >
            <span className="bg-gradient-to-b from-[var(--color-vermilion)] to-[#b5332e] bg-clip-text text-5xl font-black tracking-wider text-transparent">
              正解！
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
}
