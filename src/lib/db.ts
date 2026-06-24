import "server-only";
import { Redis } from "@upstash/redis";
import { PlayerProgress, AnsweredEntry, WinnerEntry } from "./types";

// ============================================================
//  ストレージ抽象化
//  - 本番/設定あり: Upstash Redis
//  - 環境変数が無い場合: メモリ内フォールバック（開発・ビルド用、非永続）
//
//  コマンド数を抑える設計:
//   - 進捗は読み取り時に書き戻さない（変更時だけ保存）
//   - 全問正解者は HASH に集約し、一覧取得は HGETALL の 1 コマンドで完結
// ============================================================

const WINNERS_HASH = "winners"; // field=userId, value=WinnerEntry

interface Store {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  hset<T>(key: string, field: string, value: T): Promise<void>;
  hgetall<T>(key: string): Promise<Record<string, T>>;
}

const TTL_SECONDS = 60 * 60 * 24 * 400; // 約400日（最低1年保持）

function makeRedisStore(): Store {
  const redis = Redis.fromEnv();
  return {
    async get<T>(key: string) {
      return (await redis.get<T>(key)) ?? null;
    },
    async set<T>(key: string, value: T) {
      await redis.set(key, value, { ex: TTL_SECONDS });
    },
    async hset<T>(key: string, field: string, value: T) {
      await redis.hset(key, { [field]: value });
    },
    async hgetall<T>(key: string) {
      return (await redis.hgetall<Record<string, T>>(key)) ?? {};
    },
  };
}

function makeMemoryStore(): Store {
  const kv = new Map<string, unknown>();
  const hashes = new Map<string, Map<string, unknown>>();
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[db] UPSTASH_REDIS_* が未設定のためメモリ内ストアを使用します（再起動で消えます）"
    );
  }
  return {
    async get<T>(key: string) {
      return (kv.get(key) as T) ?? null;
    },
    async set<T>(key: string, value: T) {
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
  };
}

let _store: Store | null = null;
function store(): Store {
  if (!_store) {
    const hasRedis =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
    _store = hasRedis ? makeRedisStore() : makeMemoryStore();
  }
  return _store;
}

// ------------------------------------------------------------

const playerKey = (userId: string) => `player:${userId}`;

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
 * コマンド削減のため、新規作成時・表示名変更時だけ書き込む（読み取りでは書き戻さない）。
 */
export async function getOrCreatePlayer(
  userId: string,
  displayName: string
): Promise<PlayerProgress> {
  const data = await store().get<PlayerProgress>(playerKey(userId));
  if (!data) {
    const fresh = emptyProgress(displayName);
    await store().set(playerKey(userId), fresh);
    return fresh;
  }
  if (displayName && data.displayName !== displayName) {
    data.displayName = displayName;
    await store().set(playerKey(userId), data);
  }
  return data;
}

export async function savePlayer(
  userId: string,
  progress: PlayerProgress
): Promise<void> {
  await store().set(playerKey(userId), progress);
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

/** 全問正解者として登録（HASH に upsert：1コマンド・重複なし） */
export async function registerWinner(
  userId: string,
  name: string
): Promise<void> {
  const entry: WinnerEntry = { name, clearedAt: Date.now() };
  await store().hset(WINNERS_HASH, userId, entry);
}

/** 全問正解者の一覧（クリアした順）。HGETALL の1コマンドで取得。 */
export async function listWinners(): Promise<WinnerEntry[]> {
  const all = await store().hgetall<WinnerEntry>(WINNERS_HASH);
  return Object.values(all)
    .filter((e): e is WinnerEntry => Boolean(e && e.name))
    .sort((a, b) => a.clearedAt - b.clearedAt);
}
