"use client";

import liff from "@line/liff";

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export interface LiffSession {
  ready: boolean;
  loggedIn: boolean;
  inClient: boolean;
  profile: LiffProfile | null;
  idToken: string | null;
  /** LIFF未設定（開発時のブラウザ単体）かどうか */
  mock: boolean;
  error: string | null;
}

let initPromise: Promise<void> | null = null;

/**
 * LIFFを初期化し、未ログインならログインへ誘導する。
 * NEXT_PUBLIC_LIFF_ID 未設定時はモック扱い（ブラウザ単体で画面確認用）。
 */
export async function initLiff(): Promise<LiffSession> {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liffId) {
    return {
      ready: true,
      loggedIn: false,
      inClient: false,
      profile: null,
      idToken: null,
      mock: true,
      error: null,
    };
  }

  try {
    if (!initPromise) {
      initPromise = liff.init({ liffId });
    }
    await initPromise;

    if (!liff.isLoggedIn()) {
      // ログイン画面へリダイレクト（戻ってきたら再度ここを通る）
      liff.login({ redirectUri: window.location.href });
      return {
        ready: false,
        loggedIn: false,
        inClient: liff.isInClient(),
        profile: null,
        idToken: null,
        mock: false,
        error: null,
      };
    }

    const p = await liff.getProfile();
    const idToken = liff.getIDToken();

    return {
      ready: true,
      loggedIn: true,
      inClient: liff.isInClient(),
      profile: {
        userId: p.userId,
        displayName: p.displayName,
        pictureUrl: p.pictureUrl,
      },
      idToken,
      mock: false,
      error: null,
    };
  } catch (e) {
    return {
      ready: true,
      loggedIn: false,
      inClient: false,
      profile: null,
      idToken: null,
      mock: false,
      error: e instanceof Error ? e.message : "LIFF init failed",
    };
  }
}

export { liff };
