"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";

/** 問題画面の右側に縦に並ぶヒントボタン群＋ヒントポップアップ */
export default function HintButtons({ hints }: { hints: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (hints.length === 0) return null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // クリップボード不可でもテキスト選択でコピー可能
    }
  };

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        {hints.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setOpenIndex(i);
              setCopied(false);
            }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-white shadow-md active:bg-amber-500"
          >
            ヒント{i + 1}
          </motion.button>
        ))}
      </div>

      <Modal
        open={openIndex !== null}
        title={openIndex !== null ? `ヒント${openIndex + 1}` : ""}
        onClose={() => setOpenIndex(null)}
      >
        {openIndex !== null && (
          <div className="flex flex-col gap-3">
            <p className="select-text whitespace-pre-wrap text-base leading-relaxed">
              {hints[openIndex]}
            </p>
            <button
              onClick={() => copy(hints[openIndex])}
              className="self-start rounded-lg bg-black/5 px-3 py-1.5 text-sm font-bold text-[var(--color-accent)] active:bg-black/10"
            >
              {copied ? "コピーしました" : "テキストをコピー"}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
