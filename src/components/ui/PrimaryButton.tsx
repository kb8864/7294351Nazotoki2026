"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-md disabled:opacity-40 disabled:shadow-none",
  ghost:
    "bg-white/85 text-[var(--color-ink)] border-2 border-[var(--color-ink)]/20 shadow-sm",
};

/** タップでリッチに反応するボタン */
export default function PrimaryButton({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.94 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled}
      className={`rounded-full px-6 py-3.5 text-lg font-bold transition-colors ${styles[variant]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
