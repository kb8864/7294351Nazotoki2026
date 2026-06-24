"use client";

/**
 * スマホで長押し保存できる画像。
 * （iOS/Android とも <img> の長押しで保存メニューが出る。保存を妨げる属性は付けない）
 */
export default function SaveableImage({
  src,
  alt,
  className = "",
  hint = true,
}: {
  src: string;
  alt: string;
  className?: string;
  hint?: boolean;
}) {
  return (
    <figure className={`flex flex-col items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="max-h-full max-w-full rounded-xl object-contain shadow select-none"
      />
      {hint && (
        <figcaption className="mt-1 text-[11px] text-[var(--color-ink)]/45">
          ※ 画像は長押しで保存できます
        </figcaption>
      )}
    </figure>
  );
}
