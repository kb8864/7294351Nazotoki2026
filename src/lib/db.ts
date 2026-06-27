import "server-only";
import { createClient } from "redis";
import { PlayerProgress, AnsweredEntry, WinnerEntry } from "./types";

// ============================================================
//  ストレージ抽象化
//  - 本番/設定あり: Redis（TCP, 環境変数 REDIS_URL / node-redis）
//  - REDIS_URL が無い場合: メモリ内フォールバック（開発・ビルド用、非永続）
//
//  winners は Hash（無期限＝恒久保存）、player は TTL 約400日。
// ============================================================

const WINNERS_HASH = "winners"; // field=userId, value=WinnerEntry
const PLAYER_TTL_SECONDS = 60 * 60 * 24 * 400; // 約400日

interface Store {
  get<T>(key: string): Promise<T | null>;
  setWithTtl<T>(key: string, value: T): Promise<void>;
  hset<T>(key: string, field: string, value: T): Promise<void>;
  hgetall<T>(key: string): Promise<Record<string, T>>;
  countByPrefix(prefix: string): Promise<number>;
  ping(): Promise<boolean>;
}

// ---- node-redis クライアント（サーバーレス用にキャッシュ） -------------

function makeClient(url: string) {
  return createClient({
    url,
    socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 2000) },
  });
}
type RedisClient = ReturnType<typeof makeClient>;
let client: RedisClient | null = null;
let connecting: Promise<RedisClient> | null = null;

async function getRedis(): Promise<RedisClient> {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  if (client?.isOpen) return client;
  if (!connecting) {
    connecting = (async () => {
      const c = makeClient(url);
      c.on("error", (e) => console.error("[redis] client error:", e));
      await c.connect();
      client = c;
      return c;
    })();
    // 成否にかかわらず connecting をクリア（成功後は client.isOpen 経路を使う／失敗時は再試行可能に）
    connecting.catch(() => {}).finally(() => {
      connecting = null;
    });
  }
  return connecting;
}

function makeRedisStore(): Store {
  return {
    async get<T>(key: string) {
      const c = await getRedis();
      const v = await c.get(key);
      return v ? (JSON.parse(v) as T) : null;
    },
    async setWithTtl<T>(key: string, value: T) {
      const c = await getRedis();
      await c.set(key, JSON.stringify(value), { EX: PLAYER_TTL_SECONDS });
    },
    async hset<T>(key: string, field: string, value: T) {
      const c = await getRedis();
      await c.hSet(key, field, JSON.stringify(value));
    },
    async hgetall<T>(key: string) {
      const c = await getRedis();
      const obj = await c.hGetAll(key);
      const out: Record<string, T> = {};
      for (const [k, v] of Object.entries(obj)) {
        try {
          out[k] = JSON.parse(v as string) as T;
        } catch {
          /* skip malformed */
        }
      }
      return out;
    },
    async countByPrefix(prefix: string) {
      const c = await getRedis();
      let cursor = "0";
      let count = 0;
      do {
        const res = await c.scan(cursor, { MATCH: `${prefix}*`, COUNT: 200 });
        cursor = String(res.cursor);
        count += res.keys.length;
      } while (cursor !== "0");
      return count;
    },
    async ping() {
      const c = await getRedis();
      await c.set("__health_check__", String(Date.now()), { EX: 60 });
      const v = await c.get("__health_check__");
      return Boolean(v);
    },
  };
}

// ---- メモリ内フォールバック（開発用・非永続） ------------------------

function makeMemoryStore(): Store {
  const kv = new Map<string, unknown>();
  const hashes = new Map<string, Map<string, unknown>>();
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[db] REDIS_URL が未設定のためメモリ内ストアを使用します（再起動で消えます）"
    );
  }
  return {
    async get<T>(key: string) {
      return (kv.get(key) as T) ?? null;
    },
    async setWithTtl<T>(key: string, value: T) {
      kv.set(key, value);
    },
    async hset<T>(key: string, field: string, value: T) {
      let h = hashes.get(key);
      if (!h) {
        h = new Map();
        hashes.set(key, h);
      }
      h.set(field, value);
    },
    async hgetall<T>(key: string) {
      const h = hashes.get(key);
      const out: Record<string, T> = {};
      if (h) for (const [f, v] of h) out[f] = v as T;
      return out;
    },
    async countByPrefix(prefix: string) {
      let count = 0;
      for (const k of kv.keys()) if (k.startsWith(prefix)) count++;
      return count;
    },
    async ping() {
      return true;
    },
  };
}

let _store: Store | null = null;
function store(): Store {
  if (!_store) {
    _store = process.env.REDIS_URL ? makeRedisStore() : makeMemoryStore();
  }
  return _store;
}

/** 永続ストレージ（Redis）が設定されているか */
export function hasPersistentStorage(): boolean {
  return Boolean(process.env.REDIS_URL);
}

/**
 * 保存先の診断。実際に書き込み→読み出しして接続が生きているかも確認する。
 * 秘密情報は返さない。
 */
export async function storageStatus(): Promise<{
  mode: "redis" | "memory";
  ok: boolean;
  persistent: boolean;
}> {
  const mode = hasPersistentStorage() ? "redis" : "memory";
  try {
    const ok = await store().ping();
    return { mode, ok, persistent: mode === "redis" && ok };
  } catch {
    return { mode, ok: false, persistent: false };
  }
}

// ------------------------------------------------------------

const playerKey = (userId: string) => `player:${userId}`;
const winnerKey = (userId: string) => userId; // winners ハッシュの field

function emptyProgress(displayName: string): PlayerProgress {
  return {
    displayName,
    mainSolved: 0,
    bonusSolved: 0,
    mainCleared: false,
    bonusCleared: false,
    answered: [],
  };
}

/**
 * プレイヤー進捗を取得（なければ初期化）。
 * 新規作成時・表示名変更時だけ書き込む（読み取りでは書き戻さない）。
 */
export async function getOrCreatePlayer(
  userId: string,
  displayName: string
): Promise<PlayerProgress> {
  const data = await store().get<PlayerProgress>(playerKey(userId));
  if (!data) {
    const fresh = emptyProgress(displayName);
    await store().setWithTtl(playerKey(userId), fresh);
    return fresh;
  }
  if (displayName && data.displayName !== displayName) {
    data.displayName = displayName;
    await store().setWithTtl(playerKey(userId), data);
  }
  return data;
}

export async function savePlayer(
  userId: string,
  progress: PlayerProgress
): Promise<void> {
  await store().setWithTtl(playerKey(userId), progress);
}

/** 正解を記録（重複は追加しない） */
export function recordAnswer(
  progress: PlayerProgress,
  entry: AnsweredEntry
): PlayerProgress {
  const exists = progress.answered.some((a) => a.puzzleId === entry.puzzleId);
  if (!exists) {
    progress.answered = [...progress.answered, entry];
  }
  return progress;
}

/** 全問正解者として登録（HASH に upsert：恒久保存・重複なし） */
export async function registerWinner(
  userId: string,
  name: string
): Promise<void> {
  const entry: WinnerEntry = { name, clearedAt: Date.now() };
  await store().hset(WINNERS_HASH, winnerKey(userId), entry);
}

/**
 * 過去（消失した）全問正解者を手動で取り込む。
 * 決定的キー（legacy:<clearedAt>:<name>）で重複なく upsert。実ユーザー(LINE sub)とは衝突しない。
 */
export async function importWinner(
  name: string,
  clearedAt: number
): Promise<void> {
  const field = `legacy:${clearedAt}:${name}`;
  const entry: WinnerEntry = { name, clearedAt };
  await store().hset(WINNERS_HASH, field, entry);
}

/** 全問正解者の一覧（クリアした順） */
export async function listWinners(): Promise<WinnerEntry[]> {
  const all = await store().hgetall<WinnerEntry>(WINNERS_HASH);
  return Object.values(all)
    .filter((e): e is WinnerEntry => Boolean(e && e.name))
    .sort((a, b) => a.clearedAt - b.clearedAt);
}

/** 登録プレイヤー数（player:* の件数） */
export async function countPlayers(): Promise<number> {
  return store().countByPrefix("player:");
}
