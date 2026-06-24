"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LiffSession } from "@/lib/liff";
import { PlayerProgress } from "@/lib/types";
import AnsweredListModal from "./AnsweredListModal";
import WinnersModal from "./WinnersModal";
import NoticeModal from "./NoticeModal";

type ActiveModal = null | "answered" | "winners" | "notice";

/** 右上ハンバーガーメニュー。各項目はポップアップで開く（「閉じる」以外）。 */
export default function HamburgerMenu({
  session,
  progress,
}: {
  session: LiffSession | null;
  progress: PlayerProgress | null;
}) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ActiveModal>(null);

  const items: { label: string; onClick: () => void }[] = [
    { label: "回答した問題と答えを確認する", onClick: () => openModal("answered") },
    { label: "全問正解者を見る", onClick: () => openModal("winners") },
    { label: "注意事項をみる", onClick: () => openModal("notice") },
    { label: "メニューを閉じる", onClick: () => setOpen(false) },
  ];

  function openModal(m: ActiveModal) {
    setModal(m);
    setOpen(false);
  }

  return (
    <>
      {/* ハンバーガーボタン */}
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        aria-label="メニューを開く"
        className="absolute right-3 top-3 z-30 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl bg-white/90 shadow-md backdrop-blur"
      >
        <span className="block h-0.5 w-6 rounded bg-[var(--color-ink)]" />
        <span className="block h-0.5 w-6 rounded bg-[var(--color-ink)]" />
        <span className="block h-0.5 w-6 rounded bg-[var(--color-ink)]" />
      </motion.button>

      {/* ドロワー */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.nav
              className="absolute right-0 top-0 flex h-full w-72 max-w-[82%] flex-col gap-1 bg-washi p-5 pt-16 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {items.map((it) => (
                <motion.button
                  key={it.label}
                  onClick={it.onClick}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg px-3 py-3.5 text-left text-base font-bold text-[var(--color-ink)] active:bg-black/5"
                >
                  {it.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ポップアップ */}
      <AnsweredListModal
        open={modal === "answered"}
        progress={progress}
        onClose={() => setModal(null)}
      />
      <WinnersModal
        open={modal === "winners"}
        session={session}
        onClose={() => setModal(null)}
      />
      <NoticeModal open={modal === "notice"} onClose={() => setModal(null)} />
    </>
  );
}
