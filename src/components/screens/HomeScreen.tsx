"use client";

import { motion } from "framer-motion";

/** ログイン後最初に出るホーム画面。タップでトップへ。 */
export default function HomeScreen({ onTap }: { onTap: () => void }) {
  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-washi"
      onClick={onTap}
      role="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-1 items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home.png"
          alt="七福脱出部 2026合宿謎"
          className="max-h-full max-w-full rounded-xl object-contain shadow-sm"
        />
      </div>
      <motion.p
        className="pb-10 text-base font-bold text-[var(--color-ink)]/60"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        タップしてはじめる
      </motion.p>
    </motion.div>
  );
}
