import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "七福の謎解きアプリ",
  description: "七福脱出部 2026合宿謎 - LINEミニアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7f1e1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* トップ背景は最初に表示されるため先読みして黒/空白の瞬間を減らす */}
        <link rel="preload" as="image" href="/images/top-bg.png" />
        <link rel="preload" as="image" href="/images/home.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
