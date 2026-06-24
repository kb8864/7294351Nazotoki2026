"use client";

import { motion } from "framer-motion";

/** 読み込み・ログイン待ち・エラー表示 */
export default function LoadingScreen({
  error,
  mock,
}: {
  error?: string | null;
  mock?: boolean;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-washi p-8 text-center">
      {error ? (
        <>
          <p className="text-lg font-bold text-[var(--color-vermilion)]">
            エラーが発生しました
          </p>
          <p className="text-sm text-[var(--color-ink)]/70">{error}</p>
        </>
      ) : (
        <>
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-[var(--color-accent)]/30 border-t-[var(--color-accent)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-base font-bold text-[var(--color-ink)]/60">
            読み込み中…
          </p>
          {mock && (
            <p className="text-xs text-[var(--color-ink)]/40">
              （開発モード：LIFF未設定）
            </p>
          )}
        </>
      )}
    </div>
  );
}
