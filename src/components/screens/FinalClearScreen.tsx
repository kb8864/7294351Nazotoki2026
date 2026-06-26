"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SaveableImage from "@/components/ui/SaveableImage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { celebrate } from "@/lib/confetti";
import { popIn } from "@/lib/motion";

/**
 * 最終クリア（謎解き完了）。画像（保存可能）＋名前入力。
 * 送信すると全問正解者に登録される。
 */
export default function FinalClearScreen({
  defaultName,
  alreadyName,
  onRegister,
  onBackToTop,
}: {
  defaultName: string;
  alreadyName?: string;
  onRegister: (name: string) => Promise<void>;
  onBackToTop: () => void;
}) {
  const [name, setName] = useState(alreadyName ?? defaultName ?? "");
  const [submitted, setSubmitted] = useState(Boolean(alreadyName));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    celebrate("clear");
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onRegister(name.trim());
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col bg-washi px-5 pb-10 pt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex flex-1 items-center justify-center"
        variants={popIn}
        initial="initial"
        animate="animate"
      >
        <SaveableImage src="/images/main-complete.jpg" alt="謎解き完了" />
      </motion.div>

      {submitted ? (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-center text-lg font-bold text-[var(--color-accent)]">
            {name} さん、登録しました！<br />
            全問正解者に追加されました🎉
          </p>
          <PrimaryButton className="w-full" onClick={onBackToTop}>
            トップへ戻る
          </PrimaryButton>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <label className="text-center text-base font-bold">
            あなたのお名前を教えてください。
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前"
            maxLength={30}
            className="w-full rounded-xl border-2 border-[var(--color-ink)]/20 bg-white px-4 py-3 text-lg outline-none focus:border-[var(--color-accent)]"
          />
          {error && (
            <p className="text-center text-sm text-[var(--color-vermilion)]">
              {error}
            </p>
          )}
          <PrimaryButton
            className="w-full"
            disabled={!name.trim() || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "送信中…" : "送信する"}
          </PrimaryButton>
        </div>
      )}
    </motion.div>
  );
}
