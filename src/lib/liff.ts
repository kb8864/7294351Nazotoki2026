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
      // 外部ブラウザでは init 時に自動ログイン。LINEアプリ内(in-client)では常にログイン済み。
      initPromise = liff.init({ liffId, withLoginOnExternalBrowser: true });
    }
    await initPromise;

    if (!liff.isLoggedIn()) {
      // in-client では通常ここに来ない。来た場合でも無限ループを避けるため、
      // 1セッションにつき1回だけ login() を試みる。
      const tried =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem("liff_login_tried");
      if (!liff.isInClient() && !tried) {
        window.sessionStorage.setItem("liff_login_tried", "1");
        liff.login({ redirectUri: window.location.href });
      }
      return {
        ready: false,
        loggedIn: false,
        inClient: liff.isInClient(),
        profile: null,
        idToken: null,
        mock: false,
        error: liff.isInClient()
          ? "LINEログイン情報を取得できませんでした。アプリを開き直してください。"
          : null,
      };
    }

    // ログイン成功 → ループ防止フラグをクリア
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("liff_login_tried");
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
