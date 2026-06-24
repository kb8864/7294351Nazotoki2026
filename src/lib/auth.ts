import "server-only";

// LINE の IDトークンを検証してユーザーを特定する。
// クライアントは liff.getIDToken() を Authorization: Bearer <idToken> で送る。

export interface AuthUser {
  userId: string; // LINE userId (sub)
  displayName: string;
  picture?: string;
}

interface LineVerifyResponse {
  sub: string;
  name?: string;
  picture?: string;
  aud?: string;
  exp?: number;
  error?: string;
  error_description?: string;
}

/**
 * リクエストの Authorization ヘッダから IDトークンを取り出し、
 * LINE のエンドポイントで検証して AuthUser を返す。失敗時は null。
 */
export async function getUser(req: Request): Promise<AuthUser | null> {
  const auth = req.headers.get("authorization") || "";
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  // 開発用バイパス（本番では無効）。LIFF未設定のブラウザ単体で動作確認するため。
  if (!idToken && process.env.NODE_ENV !== "production") {
    const devUser = req.headers.get("x-dev-user");
    if (devUser) {
      return { userId: `dev:${devUser}`, displayName: "開発ユーザー" };
    }
  }
  if (!idToken) return null;

  const channelId = process.env.LINE_CHANNEL_ID;
  if (!channelId) {
    console.error("LINE_CHANNEL_ID is not set");
    return null;
  }

  try {
    const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: channelId,
      }),
      // 検証は毎回行う
      cache: "no-store",
    });

    const data = (await res.json()) as LineVerifyResponse;
    if (!res.ok || data.error || !data.sub) {
      console.error("LINE verify failed:", data.error_description || data.error);
      return null;
    }

    return {
      userId: data.sub,
      displayName: data.name || "ゲスト",
      picture: data.picture,
    };
  } catch (e) {
    console.error("LINE verify error:", e);
    return null;
  }
}
