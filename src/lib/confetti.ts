"use client";

// 紙吹雪（クラッカー）演出。canvas-confetti を動的importして使う。
// prefers-reduced-motion 時は自動で無効（disableForReducedMotion）。

type Kind = "correct" | "clear";

type ConfettiFn = (options?: import("canvas-confetti").Options) => void;

let _confetti: ConfettiFn | null = null;

async function load(): Promise<ConfettiFn> {
  if (!_confetti) {
    const mod = await import("canvas-confetti");
    _confetti = (mod.default ?? (mod as unknown)) as ConfettiFn;
  }
  return _confetti;
}

const COLORS = ["#d7443e", "#2b6cb0", "#e8b84b", "#2f9e58", "#ffffff"];

export async function celebrate(kind: Kind) {
  if (typeof window === "undefined") return;
  const confetti = await load();
  const base = {
    colors: COLORS,
    disableForReducedMotion: true,
    zIndex: 200,
  };

  if (kind === "correct") {
    // 中央からの小〜中バースト
    confetti({
      ...base,
      particleCount: 90,
      spread: 75,
      startVelocity: 42,
      origin: { x: 0.5, y: 0.55 },
      scalar: 1.1,
    });
    return;
  }

  // clear: 左右キャノン＋中央の連続バースト（派手なクラッカー）
  const fireCannon = (x: number, angle: number) =>
    confetti({
      ...base,
      particleCount: 70,
      spread: 70,
      startVelocity: 55,
      angle,
      origin: { x, y: 0.7 },
      scalar: 1.15,
    });

  fireCannon(0.1, 60);
  fireCannon(0.9, 120);

  const end = Date.now() + 1200;
  const loop = () => {
    confetti({
      ...base,
      particleCount: 40,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.4 },
      scalar: 1.2,
    });
    if (Date.now() < end) {
      setTimeout(loop, 250);
    }
  };
  loop();
}
