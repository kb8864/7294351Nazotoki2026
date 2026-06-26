"use client";

import { Transition, Variants } from "framer-motion";

// 共通モーション定義（派手め・ただし GPU 合成のみで軽量）。
// prefers-reduced-motion は Framer Motion の MotionConfig 側で尊重する。

export const spring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

/** 下から浮き上がり＋フェード（画面・要素の入場） */
export const riseIn: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: { opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.2 } },
};

/** スプリングで弾けるように拡大（クリア画像・バッジ等） */
export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 14 },
  },
};

/** 子要素を順番に出すコンテナ */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** stagger される子要素（下から浮き上がり） */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: spring },
};

/** タップ/ホバーの押し込みフィードバック（whileTap/whileHover に展開） */
export const pressable = {
  whileTap: { scale: 0.93 },
  whileHover: { scale: 1.03 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
} as const;
